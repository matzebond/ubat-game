import express from 'express';
import bodyParser from 'body-parser';
import Promise from 'bluebird';
import db from 'sqlite';

import Tag from "../data/Tag";
import Entry from "../data/Entry";


const dbFile = './build/db.sqlite';

const port = 13750;
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
    return db.all(`SELECT t.id, t.text, COUNT(*) AS count
                    FROM tags AS t
                    JOIN entry_tag_map AS etm ON (t.id = etm.tag_id)
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
            res.json(tags);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("internal server error").end();
            return;
        });
});


app.get("/tag/text/:text", (req, res) => {
    const tagText = req.params.text;
    db.all(`SELECT tag_id AS id, tag_text AS text, COUNT(*) AS count
            FROM entry_tag_view
            WHERE tag_text LIKE ?
            GROUP BY tag_id`, tagText+'%')
        .then(rows => {
            const tags = rows.map(row => new Tag(row));
            res.json(tags);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(`no tag with text ${tagText}`).end();
            return;
        });
});

app.get("/tag/:id", (req, res) => {
    const tagID = req.params.id;
    db.get(`SELECT tag_id AS id, tag_text AS text, COUNT(*) AS count
            FROM entry_tag_view
            WHERE tag_id = ?
            GROUP BY tag_id`, tagID)
        .then(row => {
            const tag = new Tag(row);
            res.json(tag);
        })
        .catch(err => {
            res.status(400).send(`no tag with id ${tagID}`).end();
            return;
        });
});



app.post("/entry/add", async (req, res) => {
    console.log(req.body);

    const entry = new Entry(req.body);

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
          .catch(err => {
              console.log("insert into entries");
              console.log(err);
              res.status(400).send(`duplicated entry with text ${entry.text} `).end();
          })
    // for every specified tag: insert tag when new and create relation to the entry
          .then((entryID) => {
              return Promise.all(entry.tags.map(async (tag) => {
                  // get tag.id if tag already exists
                  let tagID = await db.get(`SELECT id FROM tags WHERE text LIKE ?`, tag);

                  // otherwise insert new tag
                  if (!tagID) {
                      tagID = await db.run(`INSERT INTO tags VALUES (NULL, ?)`, tag)
                          .then( (stmt) => {
                              if (!stmt.lastID) {
                                  reject("No lastID after insert into tags.");
                              }
                              return (stmt.lastID);
                          })
                          .catch(err => {
                              console.log("insert into tags");
                              console.log(err);
                              res.status(500).send("internal server error").end();
                              return;
                          });
                  }
                  else{
                      tagID = tagID.id;
                  }
                  // add relation form new entry to (new or existing) tag
                  db.run(`INSERT INTO entry_tag_map VALUES (?,?)`, entryID, tagID);
              }));
          })
        .then(() => {
            //return the created entry and all tags
            getTagList().then(tags => {
                res.json({entry, tags});
            }).catch(err => {
                console.log(err);
            });
        });
});

app.get("/entry/list", (req, res) => {
    db.all(`SELECT entry_id AS id, entry_text AS text, GROUP_CONCAT(tag_text, ';') AS tags
            FROM entry_tag_view
            GROUP BY entry_id`)
        .then(rows => {
            const entries = rows.map(row => {
                row.tags = row.tags.split(';');
                return new Entry(row);
            });
            res.json(entries);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("internal server error").end();
        });
});

app.get("/entry/text/:text", (req, res) => {
    const entryText = req.params.text;
    db.all(`SELECT entry_id AS id, entry_text AS text, COUNT(*) AS count
            FROM entry_tag_view
            WHERE entry_text LIKE ?
            GROUP BY entry_id`, entryText+'%')
        .then(rows => {
            const entrys = rows.map(row => new Entry(row));
            res.json(entrys);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(`no entry with text ${entryText}`).end();
            return;
        });
});

app.get("/entry/:id", (req, res) => {
    const entryID = req.params.id;
    db.get(`SELECT entry_id AS id, entry_text AS text, COUNT(*) AS count
            FROM entry_tag_view
            WHERE entry_id = ?`, entryID)
        .then(row => {
            const entry = new Entry(row);
            res.json(entry);
        })
        .catch(err => {
            res.status(400).send(`no entry with id ${entryID}`).end();
        });
});

Promise.resolve()
// First, try connect to the database and update its schema to the latest version
    .then(() => db.open(dbFile, { verbose: true, Promise }))
    .then(() => db.migrate({ force: 'last' }))
    .catch(err => console.error("db open or migration error\n" + err.stack))
// Finally, launch Node.js app
    .finally(() => {
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
