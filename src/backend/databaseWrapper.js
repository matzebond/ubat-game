import db from 'sqlite';

import Entry from '../data/Entry.js';
import Tag from '../data/Tag.js';
import Translation from '../data/Translation.js';

export default class DatabaseWrapper {
    constructor(database) {
        this.db = database;
    }

    async getInfo() {
        const tagCount = await this.db.get(`SELECT COUNT(*) AS count FROM tags`).then(row => row.count);
        const entryCount = await this.db.get(`SELECT COUNT(*) AS count FROM entries`).then(row => row.count);
        const langs = await this.db.all(`SELECT * FROM languages`);
        return {tagCount, entryCount, langs};
    }

    async getTagList(search="", lang) {
      const rows = await this.db.all(
        `SELECT t.id,
          COUNT(etm.tag_id) AS count,
          CASE WHEN ttv.trans_text NOT NULL THEN ttv.trans_text
          ELSE t.text END text
          FROM tags AS t
          LEFT OUTER JOIN entry_tag_map AS etm ON (t.id = etm.tag_id)
          LEFT OUTER JOIN tag_translation_view AS ttv ON (t.id = ttv.tag_id AND ttv.lang_abbr = ?)
          WHERE t.text LIKE ?
          GROUP BY t.id
          ORDER BY t.id`,
          lang, '%' + search + '%');
        const tags = rows.map(row => new Tag(row));
        return tags;
    }

    async getTagTranlated(id, lang) {
        if (id === undefined) {
            return Promise.reject('id undefined');
        }
        const row = await this.db.get(
          `SELECT t.id,
            COUNT(etm.tag_id) AS count,
            CASE WHEN ttv.trans_text NOT NULL THEN ttv.trans_text
            ELSE t.text END text
            FROM tags AS t
            LEFT OUTER JOIN entry_tag_map AS etm ON (t.id = etm.tag_id)
            LEFT OUTER JOIN tag_translation_view AS ttv ON (t.id = ttv.tag_id AND ttv.lang_abbr = ?)
            WHERE t.id = ?
            GROUP BY t.id
            ORDER BY t.id`,
          lang, id);
      if (!row) {
        return null;
      }
      return Tag.fromDB(row);
    }

    async getTagById(id) {
        const res = await this.db.get(
            `SELECT t.id,
                COUNT(etm.tag_id) AS count,
                t.text AS text
            FROM tags AS t
            LEFT OUTER JOIN entry_tag_map AS etm ON (t.id = etm.tag_id)
            WHERE t.id = ?
            GROUP BY t.id
            ORDER BY t.id`, id);

        const res_trans = await this.db.all(
            `SELECT lang_abbr AS abbr, trans_text AS trans
            FROM tag_translation_view
            WHERE tag_id = ?`, id);

        if (!res) {
            return null;
        }

        res.trans = res_trans;

        return Tag.fromDB(res);
    }

    async addTag(tag) {
        if (tag.id !== null) {
            return Promise.reject(`can't create tag which already has an id (${tag.id})`);
        }

        const res = await this.db.run(`INSERT INTO tags VALUES (NULL, ?)`, tag.text);
        tag.id = res.lastID;

        return this.getTagById(tag.id);
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


    async getEntryList(search="", lang) {
        const rows = await this.db.all(
            `SELECT et.entry_id AS id,
                CASE WHEN etl.trans_text NOT NULL THEN etl.trans_text
                ELSE et.entry_text END text,
                GROUP_CONCAT(et.tag_id, ';') AS tagIDs
            FROM entry_tag_view AS et
            LEFT OUTER JOIN entry_translation_view AS etl
                ON (et.entry_id = etl.entry_id AND etl.lang_abbr = ?)
            WHERE et.entry_text LIKE ?
            GROUP BY et.entry_id`,
            lang, '%' + search + '%');

        const entries = rows.map(row => Entry.fromDB(row));

        return entries;
    }

    async getEntryByID(id) {
        const res = await this.db.get(
            `SELECT et.entry_id AS id,
                    et.entry_text AS text,
                    GROUP_CONCAT(et.tag_id, ';') AS tagIDs
            FROM entry_tag_view AS et
            LEFT OUTER JOIN entry_tag_view AS etv
                ON (et.entry_id = etv.entry_id)
            WHERE et.entry_id = ?
            GROUP BY et.entry_id`, id);

        const res_trans = await this.db.all(
            `SELECT lang_abbr AS abbr, trans_text AS trans
            FROM entry_translation_view
            WHERE entry_id = ?`, id);

        if (!res) {
            return null;
        }

        res.trans = res_trans;

        return Entry.fromDB(res);
    }

    addEntry(entry) {
        if (entry.id !== null) {
            return Promise.reject(`can't create entry which already has an id (${entry.id})`);
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
    async updateOrAddEntry(entry) {
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

  async deleteEntry(id) {
    const result = await db.run(`UPDATE entries SET deleted=1 WHERE id = ?;`, id);

    if (!result.changes) {
      return Promise.reject(`couldn't delete entry with id ${id}`);
    }

    // await db.run(`DELETE FROM entry_tag_map WHERE entry_id = ?`, entryID);

    return null;
  }
}
