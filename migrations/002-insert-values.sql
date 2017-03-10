-----------------------
-- Up
-----------------------

INSERT INTO entries VALUES(1,'John Snow');
INSERT INTO entries VALUES(2,'Bill Gates');
INSERT INTO entries VALUES(3,'Petyr Baelish');
INSERT INTO entries VALUES(4,'Tyrion Lannister');
INSERT INTO entries VALUES(5,'Jon Stewart');
INSERT INTO entries VALUES(6,'John Oliver');
INSERT INTO tags VALUES(1,'Series');
INSERT INTO tags VALUES(2,'Game of Thrones');
INSERT INTO tags VALUES(3,'Programmer');
INSERT INTO tags VALUES(4,'Billionaire');
INSERT INTO tags VALUES(5,'Comedian');
INSERT INTO tags VALUES(6,'TV Host');
INSERT INTO tags VALUES(7,'Actor');
INSERT INTO entry_tag_map VALUES(1,1);
INSERT INTO entry_tag_map VALUES(1,2);
INSERT INTO entry_tag_map VALUES(2,3);
INSERT INTO entry_tag_map VALUES(2,4);
INSERT INTO entry_tag_map VALUES(3,1);
INSERT INTO entry_tag_map VALUES(3,2);
INSERT INTO entry_tag_map VALUES(4,1);
INSERT INTO entry_tag_map VALUES(4,2);
INSERT INTO entry_tag_map VALUES(5,5);
INSERT INTO entry_tag_map VALUES(5,6);
INSERT INTO entry_tag_map VALUES(5,7);
INSERT INTO entry_tag_map VALUES(6,5);
INSERT INTO entry_tag_map VALUES(6,6);
INSERT INTO entry_tag_map VALUES(6,7);

-----------------------
-- Down
-----------------------

DELETE FROM entry_tag_map;
DELETE FROM entries;
DELETE FROM tags;
