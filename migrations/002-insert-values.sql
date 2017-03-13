-----------------------
-- Up
-----------------------

INSERT INTO entries VALUES(1,'Richard Stallman');
INSERT INTO entries VALUES(2,'Linus Torvalds');
INSERT INTO entries VALUES(3,'Steve Wozniak');
INSERT INTO entries VALUES(4,'Ada Lovelace');
INSERT INTO entries VALUES(5,'Mark Zuckerberg');
INSERT INTO entries VALUES(6,'Bill Gates');
INSERT INTO entries VALUES(7,'Aaron Swartz');
INSERT INTO entries VALUES(8,'Ken Thompson');
INSERT INTO entries VALUES(9,'Dennis Ritchie');
INSERT INTO entries VALUES(10,'Guido van Rossum');
INSERT INTO entries VALUES(11,'Larry Page');
INSERT INTO entries VALUES(12,'Sergey Brin');
INSERT INTO entries VALUES(13,'Edsger W. Dijkstra');
INSERT INTO entries VALUES(14,'John D. Carmack');
INSERT INTO entries VALUES(15,'Markus Persson');
INSERT INTO entries VALUES(16,'Tim Schafer');
INSERT INTO entries VALUES(17,'Sid Meier');
INSERT INTO entries VALUES(18,'Hideo Kojima');
INSERT INTO entries VALUES(19,'Shigeru Miyamoto');
INSERT INTO entries VALUES(20,'Steve Ballmer');
INSERT INTO tags VALUES(1,'Programmer');
INSERT INTO tags VALUES(2,'Billionaire');
INSERT INTO tags VALUES(3,'Game Designer');
INSERT INTO tags VALUES(4,'Manager');
INSERT INTO entry_tag_map VALUES(1,1);
INSERT INTO entry_tag_map VALUES(2,1);
INSERT INTO entry_tag_map VALUES(3,1);
INSERT INTO entry_tag_map VALUES(4,1);
INSERT INTO entry_tag_map VALUES(5,1);
INSERT INTO entry_tag_map VALUES(5,2);
INSERT INTO entry_tag_map VALUES(5,4);
INSERT INTO entry_tag_map VALUES(6,1);
INSERT INTO entry_tag_map VALUES(6,2);
INSERT INTO entry_tag_map VALUES(6,4);
INSERT INTO entry_tag_map VALUES(7,1);
INSERT INTO entry_tag_map VALUES(8,1);
INSERT INTO entry_tag_map VALUES(9,1);
INSERT INTO entry_tag_map VALUES(10,1);
INSERT INTO entry_tag_map VALUES(11,1);
INSERT INTO entry_tag_map VALUES(11,2);
INSERT INTO entry_tag_map VALUES(12,1);
INSERT INTO entry_tag_map VALUES(12,2);
INSERT INTO entry_tag_map VALUES(13,1);
INSERT INTO entry_tag_map VALUES(14,1);
INSERT INTO entry_tag_map VALUES(14,3);
INSERT INTO entry_tag_map VALUES(15,1);
INSERT INTO entry_tag_map VALUES(15,3);
INSERT INTO entry_tag_map VALUES(16,1);
INSERT INTO entry_tag_map VALUES(16,3);
INSERT INTO entry_tag_map VALUES(17,1);
INSERT INTO entry_tag_map VALUES(17,3);
INSERT INTO entry_tag_map VALUES(18,3);
INSERT INTO entry_tag_map VALUES(19,3);
INSERT INTO entry_tag_map VALUES(20,2);
INSERT INTO entry_tag_map VALUES(20,4);

-----------------------
-- Down
-----------------------

DELETE FROM entry_tag_map WHERE;
DELETE FROM entries WHERE;
DELETE FROM tags WHERE;
