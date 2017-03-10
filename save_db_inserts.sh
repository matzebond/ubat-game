#!/bin/sh

echo "-----------------------
-- Up
-----------------------
" > ${1}

sqlite="
.mode insert entries
select * from entries;
.mode insert tags
select * from tags;
.mode insert entry_tag_map
select * from entry_tag_map;"

echo "$sqlite" | sqlite3 ./build/db.sqlite >> $1

echo "
-----------------------
-- Down
-----------------------

DELETE FROM entry_tag_map WHERE;
DELETE FROM entries WHERE;
DELETE FROM tags WHERE;" >> $1
