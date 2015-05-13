#!/bin/bsh

id=0

while read line
do
	let id=id+1
	echo \{ \"_id\" \: \"${id}\", \"name\" \: \"${line}\" \}
done < imagelist.txt