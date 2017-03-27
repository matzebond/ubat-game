#!/bin/sh

echo "-----------------------
-- Up
-----------------------
" > ${2}

sqlite="
.mode insert entries
select * from entries order by id;
.mode insert tags
select * from tags order by id;
.mode insert entry_tag_map
select * from entry_tag_map order by entry_id, tag_id;"

echo "$sqlite" | sqlite3 $1 >> $2

echo "
-----------------------
-- Down
-----------------------

DELETE FROM entry_tag_map;
DELETE FROM entries;
DELETE FROM tags;" >> $2
