#!/bin/bash

if [ ! -f ./env.sh ]; then
    echo "Config file not found - Exit"
    exit 1
fi

source ./env.sh


function main {
    if $IMPORT_BINARY_DATA
    then
        echo "Binary data will be uploaded to minio"
        upload_binary_data
    fi

    if $AUTH
    then
        get_access_token
    fi

    import_incidents
}

get_access_token() {
    # get access token
    echo "Getting access token from " $AUTH_URL
    ACCESS_TOKEN=`curl -X POST -d "realm=aicockpit" -d "client_id=aicockpit" -d "username=$USERNAME" -d "password=$PASSWORD" -d "grant_type=password" $AUTH_URL | jq -r '.access_token'`
}

upload_binary_data() {
    echo "Importing binary data from $BINARY_DATA"

    mc alias set myminio $MINIO_LOCATION $MINIO_USER $MINIO_PASSWORD;
    mc mb -p myminio/anomalies
    mc ls myminio
    mc policy set public myminio/anomalies
    ls -al $BINARY_DATA
    mc cp --recursive BINARY_DATA/* myminio/anomalies
}

import_incidents() {
    echo "start inserting data to " $URL_DECISIONS " from input file " $JSON_FILE " with intervall " $INTERVAL
    # capture data from json file and send to ai cockpit
    jq -c '.[]' "$JSON_FILE" | while read -r obj; do
        insert_datetime=$(date '+%Y-%m-%dT%H:%M:%SZ')
        obj=$(echo "${obj/DATETIME/"$insert_datetime"}")
        echo $obj
        curl -X POST -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" -d "$obj" "$URL_DECISIONS"
        sleep "$INTERVAL"
    done
}

main "$@"
