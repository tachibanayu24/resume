CREATE TABLE resumes (
  id INTEGER PRIMARY KEY,
  markdown TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);
INSERT INTO resumes (markdown) VALUES ('# Heading 1
## Heading 2
### Heading 3

**Bold**
[Link](https://example.com)

- List item 1
- List item 2
- List item 3

1. Numbered list item 1
2. Numbered list item 2
3. Numbered list item 3

> Blockquote

```
Code block
```
');

CREATE TABLE passwords (
  id INTEGER PRIMARY KEY,
  password TEXT NOT NULL,
  disabled BOOLEAN NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  expires_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime', '+14 days'))
);

INSERT INTO passwords (password) VALUES ('password');
