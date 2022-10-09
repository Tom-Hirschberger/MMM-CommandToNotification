#!/bin/bash
fileToWatch="/home/pi/TeleFrame/images/images.json"
dateFile=/tmp/fileWatch.date
while getopts f:t: flag
do
    case "${flag}" in
        f) fileToWatch=${OPTARG};;
        t) dateFile=${OPTARG};;
        *) echo "Invalid argument ${OPTARG}";;
    esac
done

if [ -e $fileToWatch ]
then
    fileTimestamp=$(date +%s -r "$fileToWatch")
    curTimestamp=$(date +%s)

    if [ -e $dateFile ]
    then
        lastUpdateTimestamp="$(cat "$dateFile" | head -n 1)"
    else
        lastUpdateTimestamp=0
    fi

    diffOne=$(echo "$curTimestamp - $fileTimestamp" | bc)
    diffTwo=$(echo "$fileTimestamp - $lastUpdateTimestamp" | bc)
        
    if [ $diffOne -gt 5 ] && [ $diffTwo -gt 0 ]
    then
        echo "modified"
        date +%s > $dateFile
        exit 1
    else
        echo "unchanged or change to close"
        exit 0
    fi
else
    echo "file $fileToWatch does not exist"
    exit 3
fi