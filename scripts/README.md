# Example scripts

This directory contains some example scripts to read environment sensors and more.
Please check the script files for installation instructions in the header lines.

As of version 0.0.8 of this module i would suggest to use the virtual environment wrapper script `venvWrapper.py` to install the dependencies and run any of the python scripts in this directory. All instructions in this readme make use of the script now!

**Please do not modfiy the script files in this directory or you will get problems during updates of the module. Rather copy and modify them if you need to make any changes!**

You can put your own files within this directory they will be ignored during updates.

## temperature/bme280

Read the temperature, humidity and pressure of a BME280 sensor connected to the I2C bus and return the values in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Requirements

- Make sure to enable the I2C bus of the system by running this commands in the shell and reboot the system:

```bash
if [ `grep -c "i2c-dev" /etc/modules` -lt 1 ]; then echo "i2c-dev" | sudo tee -a /etc/modules; echo "Added"; else echo "Skipped"; fi
```

```bash
sudo reboot
```

- Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

- Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

- Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --install-libs smbus
```

- Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --run temperature/bme280
```

### Options

| Option         | Description                   | Type   | Default |
| -------------- | ----------------------------- | ------ | ------- |
| First argument | The I2C address of the sensor | String | 0x76    |

### Example output

Real:

```json
{ "temperature_c": 22.0, "humidity": 62.1, "pressure": 512.0, "temperature_f": 71.6, "error": false }
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

### Example config

```js
  {
   module: "MMM-CommandToNotification",
   config: {
    updateInterval: 30,
    commands: [
     {
      script: "./venvWrapper.py",
      args: ["--run", "./temperature/bme280", "0x76"],
      timeout: 1000,
      notifications: [
       "TEMPERATURE",
      ],
     },
    ]
   },
  },
```

This config results in:

- the BME280 sensor has the address 0x76
- if the script does not return a value within 1000ms it will be killed
- the script will be called by the wrapper every 30 seconds
- the values will be published with the notification `TEMPERATURE`

## temperature/dht11

Read the temperature and humidity of a DHT11 sensor connected to a configurable GPIO and return the values in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Requirements

- Install the Python Virtual Environment and `libgpiod2` System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv libgpiod2
```

- Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

- Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --install-libs adafruit-circuitpython-dht
```

- Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --run temperature/dht11
```

### Options

| Option         | Description                                       | Type    | Default |
| -------------- | ------------------------------------------------- | ------- | ------- |
| First argument | The number of the GPIO the sensor is connected to | Integer | 4       |

### Example output

Real:

```json
{ "temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false }
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

### Example config

```js
  {
   module: "MMM-CommandToNotification",
   config: {
    updateInterval: 30,
    commands: [
     {
      script: "./venvWrapper.py",
      args: ["--run", "./temperature/dht11", "4"],
      timeout: 2000,
      notifications: [
       "TEMPERATURE",
      ],
     },
    ]
   },
  },
```

This config results in:

- the DHT11 sensor is connected to GPIO 4
- if the script does not return a value within 2000ms it will be killed
- the script will be called by the wrapper every 30 seconds
- the values will be published with the notification `TEMPERATURE`

## temperature/dht22

Read the temperature and humidity of a DHT22 sensor connected to a configurable GPIO and return the values in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Requirements

- Install the Python Virtual Environment and `libgpiod2` System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv libgpiod2
```

- Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

- Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --install-libs adafruit-circuitpython-dht
```

- Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --run temperature/dht22
```

### Options

| Option         | Description                                       | Type    | Default |
| -------------- | ------------------------------------------------- | ------- | ------- |
| First argument | The number of the GPIO the sensor is connected to | Integer | 4       |

### Example output

Real:

```json
{ "temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false }
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

### Example config

```js
  {
   module: "MMM-CommandToNotification",
   config: {
    updateInterval: 30,
    commands: [
     {
      script: "./venvWrapper.py",
      args: ["--run", "./temperature/dht22", "4"],
      timeout: 2000,
      notifications: [
       "TEMPERATURE",
      ],
     },
    ]
   },
  },
```

This config results in:

- the DHT22 sensor is connected to GPIO 4
- if the script does not return a value within 2000ms it will be killed
- the script will be called by the wrapper every 30 seconds
- the values will be published with the notification `TEMPERATURE`

## temperature/htu21

Read the temperature and humidity of a HTU21 sensor connected to the I2C bus.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Requirements

- Make sure to enable the I2C bus of the system by running this commands in the shell and reboot the system:

```bash
if [ `grep -c "i2c-dev" /etc/modules` -lt 1 ]; then echo "i2c-dev" | sudo tee -a /etc/modules; echo "Added"; else echo "Skipped"; fi
```

```bash
sudo reboot
```

- Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

- Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

- Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --install-libs adafruit-circuitpython-htu21d
```

- Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --run temperature/htu21
```

### Example output

Real:

```json
{ "temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false }
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

### Example config

```js
  {
   module: "MMM-CommandToNotification",
   config: {
    updateInterval: 30,
    commands: [
     {
      script: "./venvWrapper.py",
      args: ["--run", "./temperature/htu21"],
      timeout: 2000,
      notifications: [
       "TEMPERATURE",
      ],
     },
    ]
   },
  },
```

This config results in:

- if the script does not return a value within 2000ms it will be killed
- the script will be called by the wrapper every 30 seconds
- the values will be published with the notification `TEMPERATURE`

## temperature/sht31d

Read the temperature and humidity of a SHT31d sensor connected to the I2C bus.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Requirements

- Make sure to enable the I2C bus of the system by running this commands in the shell and reboot the system:

```bash
if [ `grep -c "i2c-dev" /etc/modules` -lt 1 ]; then echo "i2c-dev" | sudo tee -a /etc/modules; echo "Added"; else echo "Skipped"; fi
```

```bash
sudo reboot
```

- Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

- Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

- Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --install-libs adafruit-circuitpython-sht31d
```

- Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --run temperature/sht31d
```

### Example output

Real:

```json
{ "temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false }
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

### Example config

```js
  {
   module: "MMM-CommandToNotification",
   config: {
    updateInterval: 30,
    commands: [
     {
      script: "./venvWrapper.py",
      args: ["--run", "./temperature/sht31d"],
      timeout: 2000,
      notifications: [
       "TEMPERATURE",
      ],
     },
    ]
   },
  },
```

This config results in:

- if the script does not return a value within 2000ms it will be killed
- the script will be called by the wrapper every 30 seconds
- the values will be published with the notification `TEMPERATURE`

## temperature/shtc3

Read the temperature and humidity of a SHTC3 sensor connected to the I2C bus.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Requirements

- Make sure to enable the I2C bus of the system by running this commands in the shell and reboot the system:

```bash
if [ `grep -c "i2c-dev" /etc/modules` -lt 1 ]; then echo "i2c-dev" | sudo tee -a /etc/modules; echo "Added"; else echo "Skipped"; fi
```

```bash
sudo reboot
```

- Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

- Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

- Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --install-libs smbus2
```

- Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --run temperature/shtc3
```

### Example output

Real:

```json
{ "temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false }
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

### Example config

```js
  {
   module: "MMM-CommandToNotification",
   config: {
    updateInterval: 30,
    commands: [
     {
      script: "./venvWrapper.py",
      args: ["--run", "./temperature/shtc3"],
      timeout: 2000,
      notifications: [
       "TEMPERATURE",
      ],
     },
    ]
   },
  },
```

This config results in:

- if the script does not return a value within 2000ms it will be killed
- the script will be called by the wrapper every 30 seconds
- the values will be published with the notification `TEMPERATURE`

## temperature/ds18b20

Read the temperature of a DS18B20 sensor connected to the one wire bus and return the value in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

### Requirements

- Connect VCC pin to 3.3V
- #Connect Ground pin to Ground
- Add an 4.7kOhm resister between data wire and VCC
- Add the the data wire to GPIO4 (which is the 1-wire bus pin) (more info at: https://www.circuitbasics.com/raspberry-pi-ds18b20-temperature-sensor-tutorial/)
- Add the following lines to `/etc/modules`
  - `w1_gpio`
  - `w1_therm`
- Add the following line to `/etc/boot/config.txt`
  - `dtoverlay=w1-gpio`
- Find the id of your sensor (starting with "28-") in `/sys/bus/w1/devices`: `ls /sys/bus/w1/devices/ | grep 28-`
- Check if you get values: `cat /sys/bus/w1/devices/YOUR_SENSOR_ID/w1_slave`

- Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

- Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

- Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --install-libs json
```

- Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --run ./temperature/ds18b20 YOUR_SENSOR-id
```

### Options

| Option         | Description             | Type   | Default |
| -------------- | ----------------------- | ------ | ------- |
| First argument | The id of the sensor is | String | null    |

### Example output

Real:

```json
{ "temperature_c": 22.0, "temperature_f": 71.6, "error": false }
```

Pritty Print:

```json
{
  "temperature_c": 22.0,
  "temperature_f": 71.6,
  "error": false
}
```

### Example config

```js
  {
   module: "MMM-CommandToNotification",
   config: {
    updateInterval: 45,
    commands: [
     {
      script: "./temperature/ds18b20",
      args: "123456",
      timeout: 3000,
      notifications: [
       "TEMPERATURE",
      ],
     },
    ]
   },
  },
```

This config results in:

- the DS18b20 has the id "123456"
- if the script does not return a value within 3000ms it will be killed
- the script will be called every 45 seconds by the wrapper
- the values will be published with the notification `TEMPERATURE`

## flowercare-mm.json

Read the values (temperature, moisture, light, conductivity and battery) of miflora flowercare sensors and provide them as json object.
Please see "flowercare/flowercare-mm.json" file for configuration options.

### Requirements

- Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

- Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

- Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-CommandToNotification/scripts
./venvWrapper.py --venv-name py-venv --install-libs miflora bluepy json5
```

## Options

| Option         | Description                         | Type   | Default                                                                                   |
| -------------- | ----------------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| First argument | The path of the configuration file. | String | /home/pi/MagicMirror/modules/MMM-CommandToNotification/scripts/flowercare/flowercare.json |

### Example output

If the values could read successfully the JSON contains a output object for each sensor. The key in the output object will be the name given to the sensor in the configuration.
If a error occurs the output of the sensor will be a string called "error" instead.
In the following example the name of the sensors are "Flower1" and "Flower2" and "Flower2" is not reachable.
You do not need to read all possible values of a sensor. Reading only the values displayed later will last battery of the sensor longer.

Real:

```json
{ "Flower1": { "temperature": 21.6, "moisture": 62, "light": 0, "conducitivity": 1044, "battery": 50 }, "Flower2": "error" }
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

| Option | Description                                                              | Type    | Default                                 |
| ------ | ------------------------------------------------------------------------ | ------- | --------------------------------------- |
| -f     | The path of the file to watch                                            | String  | "/home/pi/TeleFrame/images/images.json" |
| -t     | The path of the temporary file to use to save the timestamp              | String  | ""/tmp/fileWatch.date                   |
| -m     | The minium time that needs to be past before the change will be accepted | Integer | 1                                       |

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

| Option          | Description       | Type    | Default |
| --------------- | ----------------- | ------- | ------- |
| First argument  | The minimal value | Integer | -10     |
| Second argument | The maximum value | Integer | 10      |

### Example output

```bash
-1
```

## randomNumberJson.js

Generates a random number within a configurable range and return it as float and integer in JSON format.

### Options

| Option          | Description       | Type    | Default |
| --------------- | ----------------- | ------- | ------- |
| First argument  | The minimal value | Integer | -10     |
| Second argument | The maximum value | Integer | 10      |

### Example output

Real:

```json
{ "integer": 4, "float": 4.414833739448628 }
```

Pritty Print:

```json
{
  "integer": 4,
  "float": 4.414833739448628
}
```
