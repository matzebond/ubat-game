-- create initial tables
CREATE TABLE entries
       (id INTEGER PRIMARY KEY, name TEXT NOT NULL,
       CONSTRAINT unique_name UNIQUE (name)
);

CREATE TABLE tags
       (id INTEGER PRIMARY KEY, name TEXT NOT NULL,
       CONSTRAINT unique_name UNIQUE (name)
);

CREATE TABLE entry_tag_map
       (entry_id INTEGER, tag_id INTEGER, name TEXT,
       PRIMARY KEY (entry_id, tag_id),
       FOREIGN KEY(entry_id) REFERENCES entries(id),
       FOREIGN KEY(tag_id) REFERENCES tags(id)
);


CREATE VIEW entries_tag_view AS
       SELECT * FROM entries AS e
       JOIN entry_tag_map AS etm ON e.id = etm.entry_id
       JOIN tags AS t ON etm.tag_id = t
;

-- add some values
INSERT INTO entries VALUES ( 1, 'John Snow');
INSERT INTO entries VALUES ( 2, 'Bill Gates');
INSERT INTO entries VALUES ( 3, 'Petyr Baelish');
INSERT INTO entries VALUES ( 4, 'Tyrion Lannister');
INSERT INTO entries VALUES ( 5, 'Jon Stewart');
INSERT INTO entries VALUES ( 6, 'John Oliver');


INSERT INTO tags VALUES ( 1, 'Series');
INSERT INTO tags VALUES ( 2, 'Game of Thrones');
INSERT INTO tags VALUES ( 3, 'Programmer');
INSERT INTO tags VALUES ( 4, 'Billionaire');
INSERT INTO tags VALUES ( 5, 'Comedian');
INSERT INTO tags VALUES ( 6, 'TV Host');
INSERT INTO tags VALUES ( 7, 'Actor');

INSERT INTO entry_tag_map VALUES ( 1, 1);
INSERT INTO entry_tag_map VALUES ( 1, 2);
INSERT INTO entry_tag_map VALUES ( 2, 3);
INSERT INTO entry_tag_map VALUES ( 2, 4);
INSERT INTO entry_tag_map VALUES ( 3, 1);
INSERT INTO entry_tag_map VALUES ( 3, 1);
INSERT INTO entry_tag_map VALUES ( 3, 2);
INSERT INTO entry_tag_map VALUES ( 4, 1);
INSERT INTO entry_tag_map VALUES ( 4, 2);
INSERT INTO entry_tag_map VALUES ( 5, 5);
INSERT INTO entry_tag_map VALUES ( 5, 6);
INSERT INTO entry_tag_map VALUES ( 5, 7);
INSERT INTO entry_tag_map VALUES ( 6, 5);
INSERT INTO entry_tag_map VALUES ( 6, 6);
INSERT INTO entry_tag_map VALUES ( 6, 7);
