#!/bin/bash

# Fills auth.json
AUTH=auth.json
if ! [ -f "$AUTH" ]; then
    echo 'OMDb API key:'
    read omdb
    echo 'Discord bot key:'
    read discord
    printf '{\n  "omdb":"'$omdb'",\n  "discord":"'$discord'"\n}' > ./auth.json
fi

# Checks architecture before starting Docker
ARCH=`arch`
if [[ "$ARCH" == "x86"* ]]; then
    docker-compose up -d
elif [[ "$ARCH" == "arm"* ]]; then
    docker-compose -f docker-compose-arm.yml up -d
else
    echo 'Unspecified architecture. Defaulting to x86'
    docker-compose up -d
fi

# Runs bot
node src/bot.js
