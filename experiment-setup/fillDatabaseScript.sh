#!/bin/bash

# Konfiguration
JSON_FILE="fillDbData.json"
URL="http://localhost:5173/ai-cockpit/api/trafficincident"
INTERVAL=5  # Intervall in Sekunden

# Funktion zum Senden eines JSON-Objekts
send_json() {
    local obj="$1"
    curl -X POST -H "Content-Type: application/json" -d "$obj" "$URL"
}

# Endlosschleife mit Intervall
echo "starte endlosschleife"
while true; do
    # JSON-Datei einlesen und jedes Objekt senden
    jq -c '.[]' "$JSON_FILE" | while read -r obj; do
        send_json "$obj"
        sleep "$INTERVAL"
    done
done
