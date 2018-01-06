----------------------------------------------------------
-- Up
----------------------------------------------------------

ALTER TABLE entries
ADD COLUMN deleted INTEGER DEFAULT 0;

----------------------------------------------------------
-- Down
----------------------------------------------------------

ALTER TABLE entries RENAME TO temp_entries;

CREATE TABLE entries (
        id INTEGER PRIMARY KEY,
        text TEXT UNIQUE NOT NULL
);

INSERT INTO entries
SELECT id, text
FROM temp_entries;

DROP TABLE temp_entries;
