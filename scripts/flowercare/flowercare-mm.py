#! /usr/bin/env python3
# install:
#sudo pip3 install miflora
#sudo pip3 install bluepy
#sudo pip3 install json5
import sys
import json
import json5
import pprint
import time
from miflora.miflora_poller import MiFloraPoller
from btlewrap.bluepy import BluepyBackend

def read_json(file_path):
    with open(file_path, "r") as f:
        return json5.load(f)

if len(sys.argv) > 1:
    config = read_json(sys.argv[1])
else:
    config = read_json("/home/pi/MagicMirror/modules/MMM-CommandToNotification/scripts/flowercare/flowercare.json")

results = {}
for cur_sensor_config in config["sensors"]:
    cur_result = {}
    try:
        cur_poller = MiFloraPoller(cur_sensor_config["mac"], BluepyBackend)
        if cur_sensor_config["readTemperature"] == True:
            cur_result["temperature"] = cur_poller.parameter_value('temperature')
        if cur_sensor_config["readMoisture"] == True:
            cur_result["moisture"] = cur_poller.parameter_value('moisture')
        if cur_sensor_config["readLight"] == True:
            cur_result["light"] = cur_poller.parameter_value('light')
        if cur_sensor_config["readConductivity"] == True:
            cur_result["conducitivity"] = cur_poller.parameter_value('conductivity')
        if cur_sensor_config["readBattery"] == True:
            cur_result["battery"] = cur_poller.parameter_value('battery')
        results[cur_sensor_config["name"]] = cur_result
    except:
        results[cur_sensor_config["name"]] = "error"

print(json.dumps(results))
