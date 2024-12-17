import { Hono } from 'hono';
import { marked } from 'marked';

import { styles } from './stylecss.js';

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

const downloadButton = `
  <button onclick="window.print()" class="no-print">Download as PDF</button>
  <button onclick="location.href='raw'" class="no-print">Download as Markdown</button>
`

app.get('/', async (c) => {
  const { DB } = c.env;
  const stmt = DB.prepare('SELECT markdown, created_at FROM resumes ORDER BY created_at DESC LIMIT 1');
  const { results } = await stmt.all();
  const {markdown, created_at: createdAt} = results[0] as { markdown: string, created_at: string };
  const html = marked.parse(markdown as string)

  const formattedDate = new Date(createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return c.html(`
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <title>立花優斗の職務経歴書</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="favicon.ico">
    <style>
      ${styles}
    </style>
  </head>
  <body>
    <main>
      ${downloadButton}
      <h1>職務経歴書</h1>
        <div class="grid-container">
          <span>氏名</span>
          <span>立花 優斗</span>
          <span>更新日</span>
          <span>${formattedDate}</span>
        </div>
      ${html}
    </main>
  </body>
</html>
`)
})

app.get('/raw', async (c) => {
  const { DB } = c.env;
  const stmt = DB.prepare('SELECT markdown, created_at FROM resumes ORDER BY created_at DESC LIMIT 1');
  const { results } = await stmt.all();
  const {markdown, created_at: createdAt} = results[0] as { markdown: string, created_at: string };

  const formattedDate = new Date(createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return c.text(`
# 職務経歴書
氏名 立花 優斗
更新日 ${formattedDate}

${markdown}
`)
})

export default app
