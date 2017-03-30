import db from 'sqlite';
import path from 'path';

import start_server from "./server.js";

const production = process.env.NODE_ENV === 'production';

const databasePath = path.resolve(__dirname, 'db.sqlite');
const migrationsPath = path.resolve(__dirname, 'migrations');

console.log("database at " + databasePath);
console.log("migrations at " + migrationsPath);

const port = parseInt(process.env.UBAT_PORT, 10) || 13750;



// try connect to the database and update its schema to the latest version
async function openDb(pathDB, pathMig) {
    try {
        await db.open(pathDB, { verbose: true, Promise });
    }
    catch (err) {
        console.error("db open error\n", err, err.stack);
    }

    try {
        let force = production ? null : "last";
        console.log("force: " + force);
        await db.migrate({ pathMig, force }); // reset db when debugging
    }
    catch (err) {
        console.error("db migration error\n", err, err.stack);
    }

    return db;
}

function start() {
    const myDb = openDb(databasePath, migrationsPath);
    start_server(myDb, port);
}

start();
