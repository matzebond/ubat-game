import express from 'express';
import bodyParser from 'body-parser';
import db from 'sqlite';

import Tag from "../data/Tag";
import Entry from "../data/Entry";

const production = process.env.NODE_ENV === 'production';

const dbFile = './build/db.sqlite';

const port = parseInt(process.env.HEADS_UP_BACKEND_PORT, 10) || 13750;
const app = express();

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(allowCrossDomain);



const getTagList = () => {
    return db.all(`SELECT t.id, t.text, COUNT(etm.tag_id) AS count
                    FROM tags AS t
                    LEFT OUTER JOIN entry_tag_map AS etm ON (t.id = etm.tag_id)
                    GROUP BY t.id
                    ORDER BY t.id`)
        .then( rows => {
            const tags = rows.map(row => new Tag(row));
            return tags;
        });
};

app.get("/tag/list", (req, res) => {
    getTagList()
        .then(tags => {
            res.json(tags).end();
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("internal server error").end();
            return;
        });
});

app.get("/tag/text/:text", (req, res) => {
    const tagText = req.params.text;
    db.all(`SELECT tag_id AS id, tag_text AS text, COUNT(entry_id) AS count
            FROM entry_tag_view
            WHERE tag_text LIKE ?
            GROUP BY tag_id`, tagText+'%')
        .then(rows => {
            const tags = rows.map(row => new Tag(row));
            res.json(tags).end();
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
});

app.get("/tag/:id", (req, res) => {
    const tagID = req.params.id;
    db.get(`SELECT tag_id AS id, tag_text AS text, COUNT(entry_id) AS count
            FROM entry_tag_view
            WHERE tag_id = ?
            GROUP BY tag_id`, tagID)
        .then(row => {
            if (!row) {
                res.status(404).send(`no tag with id ${tagID}`).end();
                return;
            }
            const tag = new Tag(row);
            res.json(tag).end();
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
});




const parseEntryBody = function (body) {
    let entry;

    try {
        entry = new Entry(body);
    } catch (err) {
        console.log(err);
        throw "Wrong format.";
    }

    if(!entry.text) {
        throw "The entry needs a text.";
    }

    if(entry.tags.length === 0) {
        throw "The entry need at least one tag.";
    }

    return entry;
};

app.post("/entry/add", (req, res) => {
    console.log("add", JSON.stringify(req.body));
    let entry = null;
    try {
        entry = parseEntryBody(req.body);
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err).end();
        return;
    }

    // try inserting entry.text as new entry
    db.run(`INSERT INTO entries VALUES (NULL, ?)`, entry.text)
          .then(stmt => {
              if (!stmt.lastID) {
                  reject("No lastID after insert into entries.");
              }
              entry.id = stmt.lastID;
              return stmt.lastID;
          })
    // catch error when entry already exists, and send message + error code
    // Attention: db error catches as duplicate error
          .catch(err => {
              console.log("duplicate entry");
              res.status(409).send(`duplicate: entry with text "${entry.text}" already exists`).end();
              throw null;
          })
    // for every specified tag: insert tag when new and create relation to the entry
          .then((entryID) => {
              return Promise.all(entry.tags.map(async (tag) => {
                  // get tag.id if tag already exists
                  let tagID = await db.get(`SELECT id FROM tags WHERE text LIKE ?`, tag);

                  // otherwise insert new tag
                  if (!tagID) {
                      let stmt = await db.run(`INSERT INTO tags VALUES (NULL, ?)`, tag);
                      tagID = stmt.lastID;
                  }
                  else{
                      tagID = tagID.id;
                  }
                  // add relation form new entry to (new or existing) tag
                  db.run(`INSERT INTO entry_tag_map VALUES (?,?)`, entryID, tagID);
              }));
          })
        .then(async () => {
            //return the created entry and all tags
            const tags = await getTagList();
            res.json({entry, tags}).end();
        })
        .catch(err => {
            console.log(err);
            if(!res.statusCode) res.status(500);
            if (typeof err === 'string') res.send(err);
            res.end();
        });
});

app.post("/entry/update", async (req, res) => {
    console.log("update", JSON.stringify(req.body));

    let entry = null;
    try {
        entry = parseEntryBody(req.body);
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err).end();
        return;
    }

    try {
        // update entry text
        // TODO do better ??
        let result = await db.run(`UPDATE entries SET text = ? WHERE id = ?`, entry.text, entry.id)
            .catch( err => {
                return -1;
            });

        if (result == -1) throw `entry text "${entry.text}" is already used`;



        // delete tag relations
        await db.run(`DELETE FROM entry_tag_map WHERE entry_id = ?`, entry.id);

        // create tags and/or add relations
        entry.tags.map(async (tag) => {
            // get tag.id if tag already exists
            let tagID = await db.get(`SELECT id FROM tags WHERE text LIKE ?`, tag);

            // otherwise insert new tag
            if (!tagID) {
                const stmt = await db.run(`INSERT INTO tags VALUES (NULL, ?)`, tag);
                tagID = stmt.lastID;
            }
            else{
                tagID = tagID.id;
            }
            // add relation form new entry to (new or existing) tag
            db.run(`INSERT INTO entry_tag_map VALUES (?,?)`, entry.id, tagID);
        });

        //return the created entry and all tags
        const tags = await getTagList();
        res.json({entry, tags}).end();
    }
    catch (err) {
        console.log(err);
        res.status(500);
        if (typeof err === 'string') res.send(err);
        res.end();
    }
});

app.delete("/entry/delete/:id", async (req, res) => {
    const entryID = req.params.id;
    console.log("delete " + entryID);
    try {
        let result = await db.run(`DELETE FROM entries WHERE id = ?;`, entryID);

        if (!result.changes) {
            console.log(`couldn't delete entry with id ${entryID}`);
            res.status(204).send(`couldn't delete entry with id ${entryID}`).end();
            return;
        }

        await db.run(`DELETE FROM entry_tag_map WHERE entry_id = ?`, entryID);
        res.status(200).end();
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.get("/entry/list", (req, res) => {
    db.all(`SELECT entry_id AS id, entry_text AS text, GROUP_CONCAT(tag_text, ';') AS tags
            FROM entry_tag_view
            GROUP BY entry_id`)
        .then(rows => {
            const entries = rows.map(row => Entry.fromDB(row));
            res.json(entries).end();
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
});

app.get("/entry/text/:text", (req, res) => {
    const entryText = req.params.text;
    db.all(`SELECT entry_id AS id, entry_text AS text, GROUP_CONCAT(tag_text, ';') AS tags
            FROM entry_tag_view
            WHERE entry_text LIKE ?
            GROUP BY entry_id`, entryText+'%')
        .then(rows => {
            const entrys = rows.map(row => Entry.fromDB(row));
            res.json(entrys).end();
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
});

app.get("/entry/:id", (req, res) => {
    const entryID = req.params.id;
    db.get(`SELECT entry_id AS id, entry_text AS text, GROUP_CONCAT(tag_text, ';') AS tags
            FROM entry_tag_view
            WHERE entry_id = ?
            GROUP BY entry_id`, entryID)
        .then(row => {
            if (!row) {
                res.status(404).send(`no entry with id ${entryID}`).end();
                return;
            }
            console.log(row);
            const entry = Entry.fromDB(row);
            res.json(entry).end();
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
});

Promise.resolve()
// First, try connect to the database and update its schema to the latest version
    .then(() => db.open(dbFile, { verbose: true, Promise }))
    .then(() => {
        let force = production ? null : "last";
        console.log("force: " + force);
        db.migrate({ force }); // reset db when debugging
    })
    .catch(err => console.error("db open or migration error\n" + err.stack))
// Finally, launch Node.js app
    .then(() => {
        let server = app.listen(port, (err) => {
            if (err) {
                console.log('something bad happened', err);
                return;
            }
            let host = server.address().address;
            let port = server.address().port;
            console.log(`Example app listening at http://${host}:${port}`);
        });
    });
