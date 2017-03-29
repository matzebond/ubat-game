import db from 'sqlite';

import Entry from '../data/Entry.js';
import Tag from '../data/Tag.js';
import Translation from '../data/Translation.js';

export default class DatabaseWrapper {
    constructor(database) {
        this.db = database;
    }

    getTagList(search) {
        return this.db.all(`SELECT t.id, t.text, COUNT(etm.tag_id) AS count
                            FROM tags AS t
                            LEFT OUTER JOIN entry_tag_map AS etm ON (t.id = etm.tag_id)
                            WHERE t.text LIKE ?
                            GROUP BY t.id
                            ORDER BY t.id`,
                           '%' + search + '%')
            .then( rows => {
                const tags = rows.map(row => new Tag(row));
                return tags;
            });
    }

    getTagById(id) {
        if (id === undefined) {
            return Promise.reject('id undefined');
        }
        return this.db.get(`SELECT t.id, t.text, COUNT(etm.tag_id) AS count
                            FROM tags AS t
                            LEFT OUTER JOIN entry_tag_map AS etm ON (t.id = etm.tag_id)
                            WHERE t.id = ?
                            GROUP BY t.id
                            ORDER BY t.id`,
                           id)
            .then( row => {
                if (!row) return null;
                return new Tag(row);
            });
    }

    addTag(tag) {
        if (tag.id !== null) {
            return Promise.reject(`can't create tag with id ${tag.id}`);
        }

        return this.db.run(`INSERT INTO tags VALUES (NULL, ?)`, tag.text)
            .then(({lastID}) => {
                return tag.id = lastID;
            })
            .then(() => {
                return this.getTagById(tag.id);
            });
    }

    getTag(tag) {
        if (tag.id === null) {
            return this.addTag(tag);
        }
        return this.getTagById(tag.id);
    }

    /*
    updateTag(tag) {
        if (tag.id === null) {
            return Promise.reject(`can't update tag with null id`);
        }

        const curTag = await this.getTagById(tag.id)
              .then(tag => {
                  if (tag === null) {
                      return null;
                  }
                  return this.db.
              }


    }
    */


    getEntryList(search, complete = false) {
        return this.db.all(`SELECT entry_id AS id, entry_text AS text, GROUP_CONCAT(tag_id, ';') AS tagIDs
                FROM entry_tag_view
                WHERE entry_text LIKE ?
                GROUP BY entry_id`,
               '%' + search + '%')
            .then(async (rows) => {
                const entries = rows.map(row => Entry.fromDB(row));
                if (complete) {
                    for (const entry of entries) {
                        for (let i = 0; i < entry.tags.length; i++) {
                            entry.tags[i] = await this.getTagById(entry.tags[i].id);
                        }
                    }
                }
                return entries;
            });
    }

    getEntryByID(id) {
        return this.db.get(`SELECT entry_id AS id, entry_text AS text, GROUP_CONCAT(tag_id, ';') AS tagIDs
            FROM entry_tag_view
            WHERE entry_id = ?
            GROUP BY entry_id`, id)
            .then(row => {
                if (!row) {
                    return null;
                }
                return Entry.fromDB(row);
            });
    }

    addEntry(entry) {
        if (entry.id === null) {
            return Promise.reject(`can't create entry with id ${entry.id}`);
        }

        return this.db.run(`INSERT INTO entries VALUES (NULL, ?)`, entry.text)
            .then(({lastID}) => {
                entry.id = lastID;
                return entry;
            });
    }

    /*
      Updates an existing Entry.
      If Entry.id is null a new Entry will be created.
      Any new Tags in Entry.tags will also be created.
    */
    async updateEntry(entry) {
        await this.db.run('BEGIN');

        try {
            if (entry.id === null) {
                // add entry if no id
                try {
                    entry = await this.addEntry(entry);
                }
                catch (err) {
                    await this.db.run('ROLLBACK');
                    console.log("illegal entry addition: duplicate entry, text already in use");
                    console.log(err);
                    const msg = `duplicate: entry with text "${entry.text}" already exists`;
                    return {status: 303, msg};
                }
            }
            else {
                // if entry exists: update text and delete tag relations

                // ensure entry is present
                const curEntry = await this.getEntryByID(entry.id);
                if (curEntry == null) {
                    await this.db.run('ROLLBACK');
                    console.log("illegal entry update: id not found");
                    const msg = `no entry with "${entry.text}" is already used`;
                    return {status: 409, msg};
                }

                try {
                    await db.run(`UPDATE entries SET text = ? WHERE id = ?`, entry.text, entry.id);
                }
                catch (err) {
                    await this.db.run('ROLLBACK');
                    console.log("illegal entry.text update: text already used");
                    console.log(err);
                    const msg = `entry text "${entry.text}" is already used`;
                    return {status: 409, msg};
                }
                await db.run(`DELETE FROM entry_tag_map WHERE entry_id = ?`, entry.id);
            }

            // add new tags and/or create relations
            entry.tags = entry.tags.map(async (tag) => {
                tag = await this.getTag(tag);
                this.db.run(`INSERT INTO entry_tag_map VALUES (?,?)`, entry.id, tag.id);
                return tag;
            });

            await this.db.run('COMMIT');
            return {entry};
        }
        catch (err) {
            await this.db.run('ROLLBACK');
            console.log(err);
            return {status: 500};
        }
    }
}
