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
          if(curScript.startsWith("./")){
            fullScriptPath = scriptsDir+"/"+curScript
          }
          let curArgs = curCmdConfig["args"]
          let curNotifications = curCmdConfig["notifications"]

          let output = null
          try{
            let curCommand = fullScriptPath
            if(typeof curArgs !== "undefined"){
              curCommand += curArgs
            }
            if(typeof curCmdConfig["timeout"] !== "undefined"){
              // console.log(self.name+": Calling "+fullScriptPath+" with timeout of "+curCmdConfig["timeout"])
              output = execSync(curCommand, encoding="utf8", timeout=curCmdConfig["timeout"]).toString()
            } else {
              // console.log(self.name+": Calling "+fullScriptPath+" without timeout")
              output = execSync(curCommand, encoding="utf8").toString()
            }
          } catch (err){
            console.error(err)
            output = null
          }
          
          if(output !== null){
            if (typeof curNotifications !== "undefined"){
              for (let curNotiIdx = 0; curNotiIdx < curNotifications.length; curNotiIdx++){
                self.sendSocketNotification("RESULT_"+curNotifications[curNotiIdx], output)
              }
            } else {
              console.log(self.name+": "+"The script "+curScript+" has no notifications configured. It had been called but no notification will be send!")
            }
            
          }
        } else {
          console.log(self.name+": "+"Skipping script: "+curScript)
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
