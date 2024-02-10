CREATE TABLE IF NOT EXISTS quick_sentence_categories (
    category_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS quick_sentences (
    quick_sentence_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    sentence TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES quick_sentence_categories (category_id) ON DELETE CASCADE ON UPDATE NO ACTION
);