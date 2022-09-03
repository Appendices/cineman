#!/bin/bash

# Fills config.json
CONFIG='config/config.json'
if ! [ -f "$CONFIG" ]; then
    echo 'OMDb API key:'
    read omdb
    echo 'Discord bot key:'
    read bot_key
    echo 'Discord admin ID:'
    read admin_id
    printf '{\n  "omdb":"'$omdb'",\n  "bot_key":"'$bot_key'",\n  "admin_id":"'$admin_id'"\n}' > $CONFIG
fi

docker compose up -d
