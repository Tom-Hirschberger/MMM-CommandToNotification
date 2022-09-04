/* global Module

/* Magic Mirror²
 * Module: CommandToNotification
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */  
Module.register('MMM-CommandToNotification', {

  defaults: {
    updateInterval: 10,
    commands: []
  },
  
  /*
  suspend: function() {
    const self = this
  },

  resume: function() {
    const self = this
  },

  
  getScripts: function () {
		return [];
	},
  

  getStyles: function() {
    return []
  },
  

  getDom: function() {
    const self = this
    let wrapper = document.createElement('div')
    wrapper.classList.add("ctn")

    return wrapper
  },
  */

  start: function () {
    const self = this
    self.sendSocketNotification("CONFIG",self.config)
  },

  notificationReceived: function (notification, payload) {
    const self = this
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
    if(notification.startsWith("RESULT_")){
      self.sendNotification(notification.substring(7), payload)
      console.log(self.name+": "+"Sending notification -> "+notification.substring(7))
    }
  },
})
