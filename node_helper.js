/* Magic Mirror²
 * Module: CommandToNotification
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
const NodeHelper = require('node_helper')

const spawnSync = require('child_process').spawnSync
const spawn = require('child_process').spawn
const fs = require('fs')
const path = require('path')
const scriptsDir = path.join(__dirname, '/scripts')

module.exports = NodeHelper.create({

  start: function () {
    const self = this
    self.started = false

    self.cmdSkips = {}

    console.log(self.name+": "+"Module helper started")
    self.asyncOutput = {}
  },

  sleep: function(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  },

  //https://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-live
  runScript: function(command, args, options, cmdIdx, curCmdConfig, curNotifications) {
    const self = this
    let child = spawn(command, args, options);

    let scriptOutput = null;

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
        if (scriptOutput == null){
          scriptOutput = ""
        }
        data=data.toString();
        scriptOutput+=data;
    });

    // child.stderr.setEncoding('utf8');
    // child.stderr.on('data', function(data) {
    //     console.log('stderr: ' + data);

    //     data=data.toString();
    //     scriptOutput+=data;
    // });

    child.on('close', function(code) {
      if (scriptOutput != null){
        scriptOutput = scriptOutput.trim()
      }
      self.postProcessCommand(cmdIdx, curCmdConfig, curNotifications, scriptOutput, code)
    });
  },

  validateConditions: function(curCmdConfig, output, returnCode){
    if(typeof curCmdConfig["conditions"] !== "undefined"){
      if (typeof curCmdConfig["conditions"]["returnCode"] !== "undefined"){
        let matched = false
        let returnCodeConfig = curCmdConfig["conditions"]["returnCode"]
        if(!Array.isArray(returnCodeConfig)){
          returnCodeConfig = [returnCodeConfig]
        }

        for(let i=0; i < returnCodeConfig.length; i++){
          if(returnCodeConfig[i] == returnCode){
            matched = true
            break
          }
        }

        if (!matched){
          return false
        }
      }

      if (typeof curCmdConfig["conditions"]["outputContains"] !== "undefined"){
        let matched = false
        let outputConfig = curCmdConfig["conditions"]["outputContains"]
        if(!Array.isArray(outputConfig)){
          outputConfig = [outputConfig]
        }

        for(let i=0; i < outputConfig.length; i++){
          if(output.includes(outputConfig[i])){
            matched = true
            break
          }
        }
        if (!matched){
          return false
        }
      }

      return true

    } else {
      return true
    }
  },

  callCommands: async function(){
    const self = this
    console.log(self.name+": "+"Calling commands")
    for (let cmdIdx = 0; cmdIdx < self.config.commands.length; cmdIdx++) {
      let curCmdConfig = self.config.commands[cmdIdx]
      if(typeof curCmdConfig["script"] !== "undefined"){
        if((typeof curCmdConfig["skips"] === "undefined") ||
          (curCmdConfig["skips"] < self.cmdSkips[cmdIdx])
        ){
          
          self.cmdSkips[cmdIdx] = 1

          let curCommand = curCmdConfig["script"]
          let curArgs = curCmdConfig["args"]
          if(typeof curCmdConfig["args"] !== "undefined"){
            if(Array.isArray(curCmdConfig["args"])){
              curArgs = curCmdConfig["args"]
            } else {
              curArgs = curCmdConfig["args"].split(" ")
            }
          }
          let curNotifications = curCmdConfig["notifications"]

          let curEncoding = "utf8"
          if(typeof curCmdConfig["encoding"] !== "undefined"){
            curEncoding = curCmdConfig["encoding"]
          }

          let options = {
            shell: true,
            encoding: curEncoding,
            cwd: scriptsDir,
          }

          if(typeof curCmdConfig["timeout"] !== "undefined"){
            options["timeout"] = curCmdConfig["timeout"]
          }

          let output = null
          let returnCode = null
          let sync = self.config.sync
          if(typeof curCmdConfig["sync"] !== "undefined"){
            sync = curCmdConfig["sync"]
          }
          try {
            if (sync){
              console.log("Running "+ curCommand + " synchronous")
              let spawnOutput = spawnSync(curCommand, curArgs, options)
              returnCode = spawnOutput.status
              output = spawnOutput.stdout
              if (output != null){
                output = output.trim()
              }
              if(returnCode == null){
                returnCode = 1
                output += "Timeout"
              }

              self.postProcessCommand(cmdIdx, curCmdConfig, curNotifications, output, returnCode)
            } else {
              console.log("Running "+curCommand + " asynchronous")
              self.runScript(curCommand, curArgs, options, cmdIdx, curCmdConfig, curNotifications)
            }
          } catch (error) {
            console.log(error)
          }
          if (curCmdConfig["delayNext"] || false){
            console.log("Delaying next: "+curCmdConfig["delayNext"])
            await self.sleep(curCmdConfig["delayNext"])
          }
        } else {
          self.cmdSkips[cmdIdx] += 1
        }
      } else {
        console.log(self.name+": "+"The command with index "+cmdIdx+" is not configured properly. It is missing the script configuration option!")
      }
    }
  },

  postProcessCommand: function(cmdIdx, curCmdConfig, curNotifications, output, returnCode){
    const self = this
    // console.log("Postprocessing cmdIdx: "+cmdIdx)
    console.log("curCmdConfig: "+JSON.stringify(curCmdConfig))
    // console.log(output)
    // console.log(returnCode)
    if(output !== null){
      if (typeof curNotifications !== "undefined"){
        if (self.validateConditions(curCmdConfig, output, returnCode)){
          for (let curNotiIdx = 0; curNotiIdx < curNotifications.length; curNotiIdx++){
            if (Array.isArray(curNotifications[curNotiIdx])){
              if (curNotifications[curNotiIdx].length > 1){
                self.sendSocketNotification("RESULT_"+curNotifications[curNotiIdx][0], curNotifications[curNotiIdx][1])
              } else {
                self.sendSocketNotification("RESULT_"+curNotifications[curNotiIdx][0], output)
              }
            } else {
              self.sendSocketNotification("RESULT_"+curNotifications[curNotiIdx], output)
            }
          }
        }
      } else {
        console.log(self.name+": "+"The command with idx: "+cmdIdx+" has no notifications configured. It had been called but no notification will be send!")
      }
    }
  },

  setDefaultsAndStart: function(){
    const self = this
    if(self.started){
      console.log(self.name+": "+"Setting the defaults")
      if (typeof self.config["commands"] !== "undefined"){
        for (let cmdIdx = 0; cmdIdx < self.config.commands.length; cmdIdx++) {
          let curCmdConfig = self.config.commands[cmdIdx]
          if(typeof curCmdConfig["skips"] !== "undefined"){
            self.cmdSkips[cmdIdx] = curCmdConfig["skips"] + 1
          }
        }

        console.log(self.name+": "+"Call the commands initially")
        self.callCommands()
        console.log(self.name+": "+"Reschedule the next calls")
        self.rescheduleCommandCall()
      }
    } else {
      console.log(self.name+": "+"Defaults can not be set because module is not started at the moment")
    }
  },

  rescheduleCommandCall: function(){
    const self = this

    return new Promise(() => {
      setTimeout(() => {
        self.callCommands()
        self.rescheduleCommandCall()
      }, self.config.updateInterval * 1000)
    })
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
    if (notification === 'CONFIG' && self.started === false) {
      console.log(self.name+": "+"node_helper received CONFIG notification")
      self.config = payload
      self.started = true
      console.log(self.name+": "+"node_helper now will set some defaults")
      self.setDefaultsAndStart()
    }
  }
})
