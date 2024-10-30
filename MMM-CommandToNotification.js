/* MagicMirror²
 * Module: MMM-CommandToNotification
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
Module.register("MMM-CommandToNotification", {

	defaults: {
		updateInterval: 30,
		commands: [],
		sync: true,
		debug: false
	},

	start() {
		const self = this
		self.sendSocketNotification("CONFIG", self.config)
	},

	// notificationReceived(notification, payload) {
	// 	const self = this
	// },

	socketNotificationReceived(notification, payload) {
		const self = this
		if (notification.startsWith("RESULT_")) {
			self.sendNotification(notification.substring(7), payload)
		}
	},
})
