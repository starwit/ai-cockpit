#!/bin/bash

# default config
JSON_FILE="import_dummy_data.json"
URL="http://localhost:8081/ai-cockpit/api/trafficincident"
INTERVAL=10  # post intervall

function main {
    if [ -n "$1" ]; then
        echo "Param for target URL exists " $1
        URL=$1
    fi

    if [ -n "$2" ]; then
        echo "Param for input file exists " $2
        JSON_FILE=$2
    fi

    if [ -n "$3" ]; then
        echo "Param for interval exists " $3
        INTERVAL=$3
    fi
}

send_json() {

    echo "starte inserting data to " $URL " from input file " $JSON_FILE " with intervall " $INTERVAL
    # capture data from json file and send to ai cockpit
    jq -c '.[]' "$JSON_FILE" | while read -r obj; do
        # setting insert datetime
        insert_datetime=$(date '+%Y-%m-%dT%H:%M:%SZ')
        obj=$(echo "${obj/DATETIME/"$insert_datetime"}")
        echo $obj
        curl -X POST -H "Content-Type: application/json" -d "$obj" "$URL"
        sleep "$INTERVAL"
    done
}

main "$@"
