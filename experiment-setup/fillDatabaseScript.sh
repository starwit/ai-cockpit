#!/bin/bash

# default values, taking data from repo
INTERVAL=10  # post intervall
URL_BASE="http://localhost:8081/ai-cockpit/api/"
URL_DECISIONS=$URL_BASE"decision"
SCENARIO="traffic"
LANGUAGE="en"
JSON_FILE=data_structures/$SCENARIO-$LANGUAGE/demodata.json
BINARY_DATA=""

function main {
    if [ -n "$1" ]; then
        echo "Param for target Base URL exists " $1
        URL_BASE=$1
        URL_DECISIONS=$URL_BASE"/decision"
    fi

    BINARY_DATA=binary_data/$SCENARIO
    if [ -n "$2" ]; then
        echo "Param for binary exists " $2
        BINARY_DATA=$2
    fi  
    
    if [ -n "$3" ]; then
        echo "Param for scenario data exists " $3
        JSON_FILE=$3
    fi   

    if [ -n "$4" ]; then
        echo "Param for insert interval exists " $4
        INTERVAL=$4
    fi

    upload_binary_data
    import_incidents
}

upload_binary_data() {
    echo "Importing binary data from $BINARY_DATA"

    mc alias set myminio http://localhost:9000 minioadmin minioadmin;
    mc mb -p myminio/anomalies
    mc ls myminio
    mc policy set public myminio/anomalies
    ls -al binary_data/$SCENARIO/
    mc cp --recursive binary_data/$SCENARIO/* myminio/anomalies
}

import_incidents() {
    echo "starte inserting data to " $URL_DECISIONS " from input file " $JSON_FILE " with intervall " $INTERVAL
    # capture data from json file and send to ai cockpit
    jq -c '.[]' "$JSON_FILE" | while read -r obj; do
        # setting insert datetime
        insert_datetime=$(date '+%Y-%m-%dT%H:%M:%SZ')
        obj=$(echo "${obj/DATETIME/"$insert_datetime"}")
        echo $obj
        curl -X POST -H "Content-Type: application/json" -d "$obj" "$URL_DECISIONS"
        sleep "$INTERVAL"
    done
}

main "$@"
