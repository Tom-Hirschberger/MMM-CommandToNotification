#! /usr/bin/env python3
import sys
import json
import random

min = -10
max = 10

if len(sys.argv) > 1:
    min = sys.argv[1]

if len(sys.argv) > 2:
    max = sys.argv[2]

result = {}
number = random.uniform(min,max)

result["integer"] = round(number)
result["float"] = number

print(json.dumps(result))
