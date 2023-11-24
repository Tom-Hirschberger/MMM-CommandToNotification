#!/bin/bash
fp=$(readlink -f $0)
d=$(dirname $fp)
cf="$d/dummy.content"
if [ "$1" != "" ]
then
	cf="$1"
fi

cat "$cf"
exit 0
