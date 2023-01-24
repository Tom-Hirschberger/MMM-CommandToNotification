/* global Module

/* Magic Mirror²
 * Module: CommandToNotification
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */  
Module.register('MMM-CommandToNotification', {

  defaults: {
    updateInterval: 30,
    commands: [],
    sync: true
  },

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
    }
  },
})
