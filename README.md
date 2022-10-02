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
				commands: [
				]
			},
		},
```

### General
| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| updateInterval | How often should the scripts be iterated (in seconds) | Integer | 30 |
| commands | A array containing the command definition objects | Array | [] |

### Commands
| Option  | Description | Mandatory | Type | Default |
| ------- | --- | --- | --- | --- |
| script | Either a absolute path or the path of a script within "scripts" directory | true | String | null |
| args | Arguments which should be passed to the script | false | String | "" |
| timeout | Should the script be killed if it does not return within a specific amount of sedonds? | false | Integer | infinity |
| notifications | A array containing names of the notifications to send if script returns output. If not present the script gets called but no notification will be send | false | Array | [] |


### Example
Add the following example to produce the following result:
* the scripts will be iterated every 10 seconds cause no skips option is configured
* the script "scripts/randomInteger.js" gets called every iteration
  * a random number between -10 and 10 is produced
  * the timeout of the script is 5 seconds. If the script does not produce any output within 5 seconds no notifications will be send
  * if the script produces output the output will be send as payload of the notifications TEST1 and TEST2
* the script "scripts/randomNumberJson.js" will be called every fourth iteration because a three skips are configured
  * the script calculates a random number between -50 and 20 and produces a json object containing two values ("integer" and "float"). The float value is the random number the integer value the random number rounded as integer.
  * the timeout of the script is set to 10 seconds
  * the result of the script (JSON object as string) will be send as payload of notification TEST3

```
		{
			module: "MMM-CommandToNotification",
			disabled: false,
			config: {
				updateInterval: 10,
				commands: [
					{
						script: "randomInteger.js",
						args: "-10 10",
						timeout: 5,
						notifications: [
							"TEST1",
							"TEST2",
						],
					},
					{
						script: "randomNumberJson.js",
						args: "-50 20",
						skips: 3,
						timeout: 10,
						notifications: [
							"TEST3",
						],
					}
				]
			},
		},
```