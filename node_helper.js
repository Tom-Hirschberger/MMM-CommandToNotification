/* MagicMirror²
 * Module: MMM-CommandToNotification
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
const Log = require("logger")
const NodeHelper = require("node_helper")

const spawnSync = require("node:child_process").spawnSync
const spawn = require("node:child_process").spawn
const fs = require("node:fs")
const path = require("node:path")
const scriptsDir = path.join(__dirname, "/scripts")

module.exports = NodeHelper.create({

	start() {
		const self = this
		self.started = false

		self.cmdSkips = {}
		self.asyncOutput = {}
	},

	sleep(milliseconds) {
		return new Promise((resolve) => { setTimeout(resolve, milliseconds) })
	},

	// https://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-live
	runScript(command, args, options, cmdIdx, curCmdConfig, curNotifications) {
		const self = this
		const child = spawn(command, args, options)

		let scriptOutput = null

		child.stdout.setEncoding("utf8")
		child.stdout.on("data", (data) => {
			if (scriptOutput === null) {
				scriptOutput = ""
			}
			data = data.toString()
			scriptOutput += data
		})

		child.on("close", (code) => {
			if (scriptOutput !== null) {
				scriptOutput = scriptOutput.trim()
			}
			self.postProcessCommand(cmdIdx, curCmdConfig, curNotifications, scriptOutput, code)
		})
	},

	validateConditions(curCmdConfig, output, returnCode) {
		if (typeof curCmdConfig.conditions !== "undefined") {
			if (typeof curCmdConfig.conditions.returnCode !== "undefined") {
				let matched = false
				let returnCodeConfig = curCmdConfig.conditions.returnCode
				if (!Array.isArray(returnCodeConfig)) {
					returnCodeConfig = [returnCodeConfig]
				}

				for (let idx = 0; idx < returnCodeConfig.length; idx++) {
					if (returnCodeConfig[idx] === returnCode) {
						matched = true
						break
					}
				}

				if (!matched) {
					return false
				}
			}

			if (typeof curCmdConfig.conditions.outputContains !== "undefined") {
				let matched = false
				let outputConfig = curCmdConfig.conditions.outputContains
				if (!Array.isArray(outputConfig)) {
					outputConfig = [outputConfig]
				}

				for (let idx = 0; idx < outputConfig.length; idx++) {
					if (output.includes(outputConfig[idx])) {
						matched = true
						break
					}
				}
				if (!matched) {
					return false
				}
			}

			return true
		} else {
			return true
		}
	},

	validateAndModifyPath(thePath) {
		let newPath
		let testPath

		if (thePath.startsWith("/")) {
			// absolute path. Nothing to do
			newPath = thePath
			testPath = newPath
		} else if (thePath.indexOf("/") > 0) {
			// path contains a "/". lets check if it is a relative one
			if (thePath.startsWith("./")) {
				// relative starting at the current directory
				newPath = thePath
				testPath = scriptsDir + thePath.substring(1)
			} else if (thePath.startsWith("../")) {
				// relative targeting the directory one up
				newPath = thePath
				testPath = `${scriptsDir}/${thePath}`
			} else {
				// its a relative path so we add a "./"
				newPath = `./${thePath}`
				testPath = `${scriptsDir}/${thePath}`
			}
		} else {
			// as it is a path without any "/" it is either a script in the scripts directory or a command in $PATH
			// lets check if the script exists in the script directory
			testPath = `${scriptsDir}/${thePath}`
			if (fs.existsSync(testPath)) {
				// its a script in the scripts dir
				newPath = testPath
			} else {
				// it might be a command in $PATH but we can not test it
				newPath = thePath
				testPath = null
			}
		}

		if (testPath !== null) {
			try {
				testPath = fs.realpathSync(testPath)
			} catch { /* Keep the old value */ }
		}

		return { thePath: newPath, testPath }
	},

	async callCommands() {
		const self = this
		Log.log(`${this.name}: Calling commands`)
		for (let cmdIdx = 0; cmdIdx < self.config.commands.length; cmdIdx++) {
			const curCmdConfig = self.config.commands[cmdIdx]
			if (typeof curCmdConfig.script !== "undefined") {
				if ((typeof curCmdConfig.skips === "undefined") || (curCmdConfig.skips < self.cmdSkips[cmdIdx])
				) {
					self.cmdSkips[cmdIdx] = 1

					const curCommand = curCmdConfig.script

					const modCommand = self.validateAndModifyPath(curCommand)

					if ((modCommand.testPath === null) || fs.existsSync(modCommand.testPath)) {
						let isExecutable = true
						if (modCommand.testPath !== null) {
							try {
								fs.accessSync(modCommand.testPath, fs.constants.X_OK)
							} catch {
								isExecutable = false
							}
						}

						if (isExecutable) {
							let curArgs = curCmdConfig.args
							if (typeof curCmdConfig.args !== "undefined") {
								if (Array.isArray(curCmdConfig.args)) {
									curArgs = curCmdConfig.args
								} else {
									curArgs = curCmdConfig.args.split(" ")
								}
							}
							const curNotifications = curCmdConfig.notifications

							let curEncoding = "utf8"
							if (typeof curCmdConfig.encoding !== "undefined") {
								curEncoding = curCmdConfig.encoding
							}

							const options = {
								shell: true,
								encoding: curEncoding,
								cwd: scriptsDir,
							}

							if (typeof curCmdConfig.timeout !== "undefined") {
								options.timeout = curCmdConfig.timeout
							}

							let output
							let returnCode
							let sync = self.config.sync
							if (typeof curCmdConfig.sync !== "undefined") {
								sync = curCmdConfig.sync
							}
							try {
								if (sync) {
									if (self.config.debug) {
										Log.log(`${self.name}: Running ${modCommand.thePath} synchronous`)
									}

									const spawnOutput = spawnSync(modCommand.thePath, curArgs, options)
									returnCode = spawnOutput.status
									output = spawnOutput.stdout
									if (output !== null) {
										output = output.trim()
									}
									if (returnCode === null) {
										returnCode = 1
										output += "Timeout"
									}

									self.postProcessCommand(cmdIdx, curCmdConfig, curNotifications, output, returnCode)
								} else {
									if (self.config.debug) {
										Log.log(`${self.name}: Running ${curCommand} asynchronous`)
									}
									self.runScript(modCommand.thePath, curArgs, options, cmdIdx, curCmdConfig, curNotifications)
								}
							} catch (error) {
								Log.log(`${self.name}: Error during call of command with index ${cmdIdx}`)
								Log.log(error)
							}
						} else {
							Log.log(`${self.name}: The command with index ${cmdIdx} could not be executed. The file ${modCommand.testPath} is not executable!`)
						}
					} else {
						Log.log(`${self.name}: The command with index ${cmdIdx} could not be executed. The file ${modCommand.testPath} does not exist!`)
					}
					if (curCmdConfig.delayNext || false) {
						if (self.config.debug) {
							Log.log(`${self.name}: Delaying next: ${curCmdConfig.delayNext}`)
						}
						await self.sleep(curCmdConfig.delayNext)
					}
				} else {
					self.cmdSkips[cmdIdx] += 1
				}
			} else {
				Log.log(`${self.name}: The command with index ${cmdIdx} is not configured properly. It is missing the script configuration option!`)
			}
		}
	},

	postProcessCommand(cmdIdx, curCmdConfig, curNotifications, output, returnCode) {
		const self = this
		if (self.config.debug) {
			Log.log(`${self.name}: Postprocessing cmdIdx: ${cmdIdx}`)
			Log.log(`${self.name}: curCmdConfig: ${JSON.stringify(curCmdConfig)}`)
			Log.log(output)
			Log.log(`Return code: ${returnCode}`)
		}

		if (output !== null) {
			if (typeof curNotifications !== "undefined") {
				if (self.validateConditions(curCmdConfig, output, returnCode)) {
					for (let curNotiIdx = 0; curNotiIdx < curNotifications.length; curNotiIdx++) {
						if (Array.isArray(curNotifications[curNotiIdx])) {
							if (curNotifications[curNotiIdx].length > 1) {
								self.sendSocketNotification(`RESULT_${curNotifications[curNotiIdx][0]}`, curNotifications[curNotiIdx][1])
							} else {
								self.sendSocketNotification(`RESULT_${curNotifications[curNotiIdx][0]}`, output)
							}
						} else {
							self.sendSocketNotification(`RESULT_${curNotifications[curNotiIdx]}`, output)
						}
					}
				}
			} else {
				Log.log(`${self.name}: The command with idx: ${cmdIdx} has no notifications configured. It had been called but no notification will be send!`)
			}
		}
	},

	setDefaultsAndStart() {
		const self = this
		if (self.started) {
			if (self.config.debug) {
				Log.log(`${self.name}: Setting the defaults`)
			}
			if (typeof self.config.commands !== "undefined") {
				for (let cmdIdx = 0; cmdIdx < self.config.commands.length; cmdIdx++) {
					const curCmdConfig = self.config.commands[cmdIdx]
					if (typeof curCmdConfig.skips !== "undefined") {
						self.cmdSkips[cmdIdx] = curCmdConfig.skips + 1
					}
				}

				if (self.config.debug) {
					Log.log(`${self.name}: Call the commands initially`)
				}
				self.callCommands()
				if (self.config.debug) {
					Log.log(`${self.name}: Reschedule the next calls`)
				}
				self.rescheduleCommandCall()
			}
		} else {
			Log.log(`${self.name}: Defaults can not be set because module is not started at the moment`)
		}
	},

	rescheduleCommandCall() {
		const self = this

		return new Promise(() => {
			setTimeout(() => {
				self.callCommands()
				self.rescheduleCommandCall()
			}, self.config.updateInterval * 1000)
		})
	},

	socketNotificationReceived(notification, payload) {
		const self = this
		if (notification === "CONFIG" && self.started === false) {
			self.config = payload
			self.started = true
			self.setDefaultsAndStart()
		}
	}
})
