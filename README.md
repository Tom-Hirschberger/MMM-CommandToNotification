# MMM-CommandToNotification
MagicMirror² module which periodically calls configured scripts and sends the output as value of configurable notifications. The values can be displayed in modules like [MMM-ValuesByNotification](https://github.com/Tom-Hirschberger/MMM-ValuesByNotification).

Example scripts to read the temperature values of DHT11, DHT22, DS18B20, HTU21 or BME280 connected to the raspbarry or Miraflor sensor in reach of bluetooth are included in the scripts directory.

## Basic installation
```
cd ~/MagicMirror/modules
git clone https://github.com/Tom-Hirschberger/MMM-CommandToNotification
cd MMM-CommandToNotification
npm install
```
## Basic configuration
Add the following code to your ~/MagicMirror/config/config.js:

```
		{
			module: "MMM-CommandToNotification",
			disabled: false,
			config: {
				updateInterval: 30,
                commands: [
                    {
                        skript: "",
                        args: "",
                        skips: 0,
                        timeout: 10,
                        notifications: [
                            "TEST1",
                            "TEST2
                        ],
                    }
                ]
			},
		},
```