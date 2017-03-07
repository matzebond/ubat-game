const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const databaseFile = './db.sqlite';

let db = new sqlite3.Database(databaseFile);

// create tables if they don't exists (e.g. db file was just created)
db.serialize(function() {
    db.run(`CREATE TABLE IF NOT EXISTS entries
                (id INTEGER PRIMARY KEY, text TEXT NOT NULL,
                CONSTRAINT unique_text UNIQUE (text)
            );`);
    db.run(`CREATE TABLE IF NOT EXISTS tags
                (id INTEGER PRIMARY KEY, text TEXT NOT NULL,
                CONSTRAINT unique_text UNIQUE (text)
            );`);
    db.run(`CREATE TABLE IF NOT EXISTS entry_tag_map
                (entry_id INTEGER, tag_id INTEGER,
                PRIMARY KEY (entry_id, tag_id),
                FOREIGN KEY(entry_id) REFERENCES entries(id),
                FOREIGN KEY(tag_id) REFERENCES tags(id)
            );`);
});

exports.addEntry = function ({text, tags}, callback = () => {}) {
    db.serialize(() => {
        db.run(`INSERT OR IGNORE INTO entries VALUES (NULL, ?)`, text, function(err) {
            if (err) {
                console.log(err);
                return;
            }

            if (this.lastID) {
                let entryID = this.lastID;

                tags.forEach(function(tag) {
                    db.run(`INSERT OR IGNORE INTO tags VALUES (NULL, ?)`, tag, function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        if(this.lastID) {
                            let tagID = this.lastID;

                            db.run(`INSERT INTO entry_tag_map VALUES (?,?)`, entryID, tagID);
                        }
                    });
                });
            }
            callback(this.lastID);
        });
    });
};

exports.listTags = function (callback = () => {}) {
    db.serialize(() => {
        db.all(`SELECT text FROM tags;`, function (err, rows) {
            if (err) {
                console.log(err);
                return;
            }

            let tags = rows.map((row) => row.text);
            callback(tags);
        });
    });
};

exports.getEntry = function (id, callback = () => {}) {
    db.serialize(() => {
        db.get(`SELECT e.id, e.text, GROUP_CONCAT(t.text, ';') as tag_list
                FROM entries AS e
                JOIN entry_tag_map AS etm ON (e.id = etm.entry_id)
                JOIN tags AS t ON (etm.tag_id = t.id)
                WHERE e.id = ?`,
               id,
               function (err, row) {
                   if (err) {
                       console.log(err);
                       return;
                   }
                   let id = row.id;
                   let text = row.text;
                   let tags = row.tag_list.split(';');
                   callback({id, text, tags});
               });
    });
};

exports.getEntries = function (tags, callback = () => {}) {
    db.serialize(() => {
        db.all(`SELECT * FROM entries JOIN WHERE;`, function (err, rows) {
            if (err) {
                console.log(err);
                return;
            }

            callback(rows);
        });
    });
};



exports.addEntry({ text: "John Snow", tags: [ "Game of Thrones", "Series", "Character" ] });

setTimeout( () => { exports.listTags( rows => console.log(JSON.stringify(rows)) ); } , 500);
