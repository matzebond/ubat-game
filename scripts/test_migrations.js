const db = require('sqlite');
const path = require('path');
const fs = require('fs');

const databasePath = path.resolve(__dirname, 'test_migrations.sqlite');
const migrationsPath = path.resolve(__dirname, '../migrations');

console.log("database at " + databasePath.toString());
console.log("migrations at " + migrationsPath.toString());

if (fs.existsSync(databasePath)) {
    fs.unlinkSync(databasePath);
}

db.open(databasePath, { verbose: true, Promise });

try {
    testMigrations(migrationsPath, process.argv[2] == "no");
}
catch (e) {
    console.log(e);
}

async function testMigrations(location, shouldDrop) {
    const migrations = await new Promise((resolve, reject) => {
        fs.readdir(location.toString(), (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files
                        .map(x => x.match(/^(\d+).(.*?)\.sql$/))
                        .filter(x => x !== null)
                        .map(x => ({ id: Number(x[1]), name: x[2], filename: x[0] }))
                        .sort((a, b) => Math.sign(a.id - b.id)));
            }
        });
    });


    if (!migrations.length) {
        throw new Error(`No migration files found in '${location}'.`);
    }



    await Promise.all(migrations.map(migration => new Promise((resolve, reject) => {
        const filename = path.join(location, migration.filename);
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const [up, down] = data.split(/^--\s+?down/mi);
                if (!down) {
                    const message = `The ${migration.filename} file does not contain '-- Down' separator.`;
                    reject(new Error(message));
                } else {
                    migration.up = up.replace(/^--.*?$/gm, '').trim();     // Remove comments
                    migration.down = down.replace(/^--.*?$/gm, '').trim(); // and trim whitespaces
                    resolve();
                }
            }
        });
    })));



    for (const migration of migrations) {
        try {
            console.log("up of " + migration.id + " " + migration.name);
            await db.exec(migration.up);
        } catch (err) {
            throw err;
        }
    }

    if (!shouldDrop) {
        for (const migration of migrations.reverse()) {
            try {
                console.log("down of " + migration.id + " " + migration.name);
                await db.exec(migration.down);
            } catch (err) {
                throw err;
            }
        }

        if (fs.existsSync(databasePath)) {
            fs.unlinkSync(databasePath);
        }
    }
}
