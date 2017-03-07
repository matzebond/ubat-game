const fs = require('fs');
const sql = require('sql.js');

const databaseFile = './db.sqlite';

class myDB {
    openDB() {
        try{
            fs.accessSync(databaseFile, fs.R_OK | fs.W_OK); // only line expected to throw error

            console.log(`reading ${databaseFile}`);

            let buffer = fs.readFileSync(databaseFile);
            this.db = new sql.Database(buffer);

        }catch(e){
            if (e.code !== 'ENOENT') { // catch only not existing file error
                throw e;
            }

            console.log(`creating ${databaseFile}`);

            this.db = new sql.Database();
            this.createDB();
        }

        this.lastInsertIdStmt = this.db.prepare(`SELECT last_insert_rowid() as 'test'`);
    }

    writeDB() {
        let data = this.db.export();
        let buffer = new Buffer(data);
        console.log(`saving db to ${databaseFile}`);
        fs.writeFileSync(databaseFile, buffer);
    }

    closeDB() {
        this.db.close();
    }


    createDB() {
        let sqlstr = `CREATE TABLE entries (id INTEGER PRIMARY KEY, name TEXT NOT NULL,
                        CONSTRAINT unique_name UNIQUE (name)
                        );`;
        sqlstr += `CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT NOT NULL,
                    CONSTRAINT unique_name UNIQUE (name)
                    );`;
        sqlstr += `CREATE TABLE entry_tag_map (entry_id INTEGER, tag_id INTEGER, name TEXT,
                    PRIMARY KEY (entry_id, tag_id),
                    FOREIGN KEY(entry_id) REFERENCES entries(id),
                    FOREIGN KEY(tag_id) REFERENCES tags(id)
                    );`;

        this.db.run(sqlstr);
    }

    getLastInsertIndex() {
        console.log(this.lastInsertIdStmt.get());
        return 0;
    }

    addEntry({name, tags}) {
        let sqlstr = `INSERT INTO entries VALUES (NULL, ?);`;
        let result = this.db.run(sqlstr, [name]);

        let entryId = this.getLastInsertIndex();


        // sqlstr = '';
        // foreach (tag in tags) {
        //     sqlstr += `INSERT INTO tags (NULL, ?);`;
        //     sqlstr += `INSERT INTO entry_tag_map ( ${entry_id}, ? );`;
        // }
    }

    getTags() {
        let sqlstr = `SELECT name FROM tags;`;
        return this.db.exec(sqlstr).values;
    }

}

module.export = myDB;

let db = new myDB();
db.openDB();
db.addEntry({ name: "John Snow", tags: [ "Game of Thrones", "Series", "Character" ] });
db.writeDB();
db.closeDB();
