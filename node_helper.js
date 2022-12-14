/* Magic Mirror²
 * Module: CommandToNotification
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
const NodeHelper = require('node_helper')

const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')
const scriptsDir = path.join(__dirname, '/scripts')

module.exports = NodeHelper.create({

  start: function () {
    const self = this
    self.started = false

    self.cmdSkips = {}

    console.log(self.name+": "+"Module helper started")
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

  callCommands: function(){
    const self = this
    console.log(self.name+": "+"Calling commands")
    for (let cmdIdx = 0; cmdIdx < self.config.commands.length; cmdIdx++) {
      let curCmdConfig = self.config.commands[cmdIdx]
      if(typeof curCmdConfig["script"] !== "undefined"){
        let curScript = curCmdConfig["script"]
        if((typeof curCmdConfig["skips"] === "undefined") ||
          (curCmdConfig["skips"] < self.cmdSkips[cmdIdx])
        ){
          let fullScriptPath = curScript
          self.cmdSkips[cmdIdx] = 1
          if(!curScript.startsWith("/")){
            fullScriptPath = scriptsDir+"/"+curScript
          }
          let curArgs = curCmdConfig["args"]
          let curNotifications = curCmdConfig["notifications"]

          let output = null
          let returnCode = 0
          let curCommand = fullScriptPath
          if(typeof curArgs !== "undefined"){
            curCommand += " " + curArgs
          }

          try {
            if(typeof curCmdConfig["timeout"] !== "undefined"){
              // console.log(self.name+": Calling "+fullScriptPath+" with timeout of "+curCmdConfig["timeout"])
              output = execSync(curCommand, {encoding:"utf8", timeout:curCmdConfig["timeout"], cwd:scriptsDir}).toString()
            } else {
              // console.log(self.name+": Calling "+fullScriptPath+" without timeout")
              output = execSync(curCommand, {encoding:"utf8", cwd:scriptsDir}).toString()
            }
          } 
          catch (error) {
            returnCode = error.status;
            output = error.stdout.toString();
          }
          
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
              console.log(self.name+": "+"The script "+curScript+" has no notifications configured. It had been called but no notification will be send!")
            }
            
          }
        } else {
          // console.log(self.name+": "+"Skipping script: "+curScript)
          self.cmdSkips[cmdIdx] += 1
        }
      } else {
        console.log(self.name+": "+"The command with index "+cmdIdx+" is not configured properly. It is missing the script configuration option!")
      }
    }
  },

  setDefaultsAndStart: async function(){
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
        await self.rescheduleCommandCall()
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
