#!/bin/sh

user=deploy
ip=85.217.170.182
dir=/var/www/ubat-game
target="$user@$ip:$dir"

UBAT_IP=$ip npm run build:production && \
echo "backing up database" && \
rsync -aIhi --delete --delete-excluded --exclude=stats.html ./dist $target && \
rsync -aIhi --delete --exclude=db.sqlite ./build $target && \
ssh $user@$ip "source ~/.profile; forever restart $dir/build/server.js"
