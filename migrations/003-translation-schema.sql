----------------------------------------------------------
-- Up
----------------------------------------------------------

CREATE TABLE languages (
       id INTEGER PRIMARY KEY,
       name STRING UNIQUE NOT NULL,
       abbr STRING UNIQUE NOT NULL
);

CREATE TABLE entry_translations (
       entry_id INTEGER,
       lang_id INTEGER,
       trans_text STRING NOT NULL,
       PRIMARY KEY (entry_id, lang_id),
       FOREIGN KEY (entry_id) REFERENCES entries(id),
       FOREIGN KEY (lang_id) REFERENCES languages(id)
);

CREATE TABLE tag_translations (
       tag_id INTEGER,
       lang_id INTEGER,
       trans_text STRING NOT NULL,
       PRIMARY KEY (tag_id, lang_id),
       FOREIGN KEY (tag_id) REFERENCES tags(id),
       FOREIGN KEY (lang_id) REFERENCES languages(id)
);

CREATE VIEW entry_translation_view AS
       SELECT e.id AS entry_id, e.text AS entry_text, l.id AS lang_id,
              l.name AS lang_name, l.abbr AS lang_abbr, etl.trans_text
       FROM entries AS e
       LEFT OUTER JOIN entry_translations AS etl ON e.id = etl.entry_id
       LEFT OUTER JOIN languages AS l ON etl.lang_id = l.id
;

CREATE VIEW tag_translation_view AS
       SELECT t.id AS tag_id, t.text AS tag_text, l.id AS lang_id,
              l.name AS lang_name, l.abbr AS lang_abbr, ttl.trans_text
       FROM tags AS t
       LEFT OUTER JOIN tag_translations AS ttl ON t.id = ttl.tag_id
       LEFT OUTER JOIN languages AS l ON ttl.lang_id = l.id
;


INSERT INTO languages VALUES(0, "english", "en");
INSERT INTO languages VALUES(1, "Deutsch", "de");
INSERT INTO languages VALUES(2, "française", "fr");
INSERT INTO languages VALUES(3, "español", "es");
INSERT INTO languages VALUES(4, "Italiano", "it");
INSERT INTO languages VALUES(5, "русский язык", "ru");
INSERT INTO languages VALUES(6, "日本語", "jp");
INSERT INTO languages VALUES(7, "svenska", "sv");
INSERT INTO languages VALUES(8, "українська мова", "uk");

----------------------------------------------------------
-- Down
----------------------------------------------------------

DROP VIEW entry_translation_view;
DROP VIEW tag_translation_view;
DROP TABLE entry_translations;
DROP TABLE tag_translations;
DROP TABLE languages;
