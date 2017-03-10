----------------------------------------------------------
-- Up
----------------------------------------------------------

CREATE TABLE entries (
       id INTEGER PRIMARY KEY,
       text TEXT UNIQUE NOT NULL
);

CREATE TABLE tags (
       id INTEGER PRIMARY KEY,
       text TEXT UNIQUE NOT NULL
);

CREATE TABLE entry_tag_map (
       entry_id INTEGER,
       tag_id INTEGER,
       PRIMARY KEY (entry_id, tag_id),
       FOREIGN KEY(entry_id) REFERENCES entries(id),
       FOREIGN KEY(tag_id) REFERENCES tags(id)
);


CREATE VIEW entry_tag_view AS
       SELECT e.id AS entry_id, e.text AS entry_text, t.id AS tag_id, t.text AS tag_text
       FROM entries AS e
       JOIN entry_tag_map AS etm ON e.id = etm.entry_id
       JOIN tags AS t ON etm.tag_id = t.id
;

----------------------------------------------------------
-- Down
----------------------------------------------------------

DROP TABLE entries;
DROP TABLE tags;
DROP TABLE entry_tag_map;
DROP VIEW entry_tag_view;
