# Example scripts

This directory contains some example scripts to read environment sensors and more.
Please check the script files for installation instructions in the header lines.

**Please do not modfiy the script files in this directory or you will get problems during updates of the module.**

You can put your own files within this directory they will be ignored during updates.

## temperature/bme280

Read the temperature, humidity and pressure of a BME280 sensor connected to the I2C bus and return the values in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The I2C address of the sensor | String | 0x76 |

### Example output

Real:

```json
{"temperature_c": 22.0, "humidity": 62.1, "pressure": 512.0, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "humidity": 62.1,
    "pressure": 512.0,
    "temperature_f": 71.6,
    "error": false
}
```

## temperature/dht11

Read the temperature and humidity of a DHT11 sensor connected to a configurable GPIO and return the values in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The number of the GPIO the sensor is connected to | Integer | 4 |

### Example output

Real:

```json
{"temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "humidity": 62.1,
    "temperature_f": 71.6,
    "error": false
}
```

## temperature/dht22

Read the temperature and humidity of a DHT22 sensor connected to a configurable GPIO and return the values in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The number of the GPIO the sensor is connected to | Integer | 4 |

### Example output

Real:

```json
{"temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "humidity": 62.1,
    "temperature_f": 71.6,
    "error": false
}
```

## temperature/ds18b20

Read the temperature of a DS18B20 sensor connected to the one wire bus and return the value in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The id of the sensor is | String | null |

### Example output

Real:

```json
{"temperature_c": 22.0, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "temperature_f": 71.6,
    "error": false
}
```

## flowercare-mm.json

Read the values (temperature, moisture, light, conductivity and battery) of miflora flowercare sensors and provide them as json object.
Please see "flowercare/flowercare-mm.json" file for configuration options.

## Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The path of the configuration file. | String | /home/pi/MagicMirror/modules/MMM-CommandToNotification/scripts/flowercare/flowercare.json |

### Example output

If the values could read successfully the JSON contains a output object for each sensor. The key in the output object will be the name given to the sensor in the configuration.
If a error occurs the output of the sensor will be a string called "error" instead.
In the following example the name of the sensors are "Flower1" and "Flower2" and "Flower2" is not reachable.
You do not need to read all possible values of a sensor. Reading only the values displayed later will last battery of the sensor longer.

Real:

```json
{"Flower1": {"temperature": 21.6, "moisture": 62, "light": 0, "conducitivity": 1044, "battery": 50}, "Flower2": "error"}
```

Pritty Print:

```json
{
    "Flower1": {
        "battery": 50,
        "conducitivity": 1044,
        "light": 0,
        "moisture": 62,
        "temperature": 21.6
    },
    "Flower2": "error"
}
```

## fileWatch.bash

Watch a file for changes (modified timestamp) and change return code / massage of the script if it gets modified.
To save the timestamp of the last run a temporary file will be created. The path of the file can be configured via command line arguments.  
**If you want to run multiple instances of the script you need to specify different temporary files!**

## Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| -f | The path of the file to watch | String | "/home/pi/TeleFrame/images/images.json" |
| -t | The path of the temporary file to use to save the timestamp | String | ""/tmp/fileWatch.date |
| -m | The minium time that needs to be past before the change will be accepted | Integer | 1 |

## Example output

The output is different wether a error occured (because the file to watch did not exist), the file exists but was not modified or the file was modified.

### Not modified

The return code will be: 0
The output will be:

```text
ile [THE_FILE_TO_WATCH] unchanged or change to close
```

### Modified

The return code will be: 1
The output will be:

```text
ile [THE_FILE_TO_WATCH] modified
```

### File to watch does not exist

The return code will be: 3
The output will be:

```text
file [THE_FILE_TO_WATCH] does not exist
```

## randomInteger.js

Generates a random integer within a configurable range.

### Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The minimal value | Integer | -10 |
| Second argument | The maximum value | Integer | 10 |

### Example output

```bash
-1
```

## randomNumberJson.js

Generates a random number within a configurable range and return it as float and integer in JSON format.

### Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The minimal value | Integer | -10 |
| Second argument | The maximum value | Integer | 10 |

### Example output

Real:

```json
{"integer":4,"float":4.414833739448628}
```

Pritty Print:

```json
{
    "integer": 4,
    "float": 4.414833739448628
}
```
