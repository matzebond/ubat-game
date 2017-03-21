#!/bin/sh

ip=85.217.170.182
headsupdir=/var/www/heads-up-web

HEADS_UP_BACKEND_IP=$ip npm run build:production && \
scp -r ./dist deploy@$ip:$headsupdir && \
scp -r ./build deploy@$ip:$heaysupdir && \
ssh deploy@$ip forever restart $headsupdir/build/server.js
