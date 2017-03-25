# ubat
[![Build Status](https://travis-ci.org/matzebond/heads-up-web.svg?branch=master)](https://travis-ci.org/matzebond/heads-up-web)

A pretty fun party game :)

Play this game with your friends online at [ubat-game.de](http://ubat-game.de)!

A mobile device with motion sensors (accelerometer and gyroscope ) and an updated browser (so that the sensors will be passed to the web app) is recommended.

## How to play

The basic game play is a mix of "Taboo" (german "Tabu") and "Who am I?".

The game is to be played in a group >2. (the more the merrier)

You choose a category/tag and one person holds the phone/tablet in front of his/her head.
On the screen (which only the other players can see ;) a text (which stands in some connection to the tag) will appear.
The other players have to describe the entry to the active player,
without mentioning any word from the actual entry.
Once the entry is guessed (the other players decide on when the active player succeeds)
the active player nods his/her head (the phone will move along with the head) and a new entry will be shown.
When the active player shakes his/hes head the current entry will be skipped and a new entry will be shown.
For every round there is a time limit and the goal is to guess as many Entry as possible.


If you are playing on an less mobile device (laptop) and/or don't have motion detection you can still play!!!
If your device is to heavy to hold in front of your head, put the device in front of the active player facing the other players.
If the device has no motion detection, on of the players has to click the "success" or "skip" button in the web interface.

**Have fun!!**

### Pros

This web app take the concept of several mobile apps
([Heads Up!](https://play.google.com/store/apps/details?id=com.wb.headsup&hl=en), ... )
the to web.

It's no bound to a mobile platform. Everyone (mobile, tablet, PC) can play.

No in app payments for more entries. Just add your own.

Use a PC to comfortably add your entries and play them on your phone.

### Cons

none!!!!

go [play](http:///ubat-game.de)

## Technical information

The web app is written in Javascript and the backend in Javascript/node.

For the frontend React/Preact and MobX are used.

The backend is realized witch express and a sqlite3 database.

### Development

#### Installation

install `nodejs`

for the backend install `sqlite3` with your favorite package manager

clone the repository

run `npm install`

install dependencies with `npm install`

#### Build

build development versions with `npm run build`

build production versions with `npm run build:production`

the website will be build to `./dist`

the server (`server.js`) will be build to `./build`

the environment variables `UBAT_IP` (default `localhost`) and `UBAT_PORT` (default `13750`)
are used to determine the address of the backend used by the AJAX requests


#### Run development

run devWebsite with `npm run dev`
navigate to `http://localhost:8080/` for the web app

run devBackend with `npm run backend`
example get `http://localhost:13750/tag/list`

#### Run production

use `forever start ./build/server.js` to start

## Credit

[success.mp3](http://www.freesound.org/people/rhodesmas/sounds/320655/)
and [failure.mp3](http://www.freesound.org/people/rhodesmas/sounds/342756/)

from [rhodesmas](http://www.freesound.org/people/rhodesmas)
