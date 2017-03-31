import db from 'sqlite';
import path from 'path';

import start_server from "./server.js";

const production = process.env.NODE_ENV === 'production';

const databasePath = path.resolve(__dirname, 'db.sqlite');
const migrationsPath = path.resolve(__dirname, 'migrations');

console.log("database at " + databasePath);
console.log("migrations at " + migrationsPath);

const port = parseInt(process.env.UBAT_PORT, 10) || 13750;


async function start() {
    try {
        await db.open(databasePath, { verbose: true, Promise });
    }
    catch (err) {
        console.error("db open error\n", err, err.stack);
    }

    // apply migrations, when in debugging reset last migration
    try {
        let force = production ? null : "last";
        console.log("force: " + force);
        await db.migrate({ migrationsPath, force });
    }
    catch (err) {
        console.error("db migration error\n", err, err.stack);
    }

    start_server(db, port);
}

start();
