import { Hono } from 'hono';
import {
  getCookie,
  setCookie,
} from 'hono/cookie';
import { marked } from 'marked';

import { Bindings } from './binding-type.js';
import { getPasswordStatus } from './get-password-status.js';
import { html } from './ui';

const app = new Hono<{ Bindings: Bindings }>()

const COOKIE_NAME = 'valid_password';


app.use(async (c, next) => {
  const path = c.req.path;
  if (path === '/login') {
    await next();
    return;
  }

  const { DB } = c.env;
  const status = await getPasswordStatus(DB);

  if (status.disabled) {
    await next();
    return;
  }

  const cookieVal = getCookie(c, COOKIE_NAME);

  if (!cookieVal || cookieVal !== status.password || status.expired) {
    setCookie(c, COOKIE_NAME, '', { path: '/', maxAge: 0 });
    return c.redirect('/login');
  }

  await next();
});

app.get('/login', async (c) => {
  const { DB } = c.env;
  const status = await getPasswordStatus(DB);

  if (status.disabled) {
    return c.redirect('/');
  }

  return c.html(html(`
      <form method="POST">
        <label for="password">パスワードが必要です。ご連絡いただければお知らせします。</label>
        <input id="password" name="password" required>
        <button type="submit">送信</button>
      </form>
  `));
});

app.post('/login', async (c) => {
  const { DB } = c.env;
  const status = await getPasswordStatus(DB);
  const formData = await c.req.parseBody();
  const passwordInput = formData['password'];

  if (status.disabled) {
    return c.redirect('/');
  }

  if (status.expired || passwordInput !== status.password) {
    return c.html(html(`
      <form method="POST">
        <div class="error">パスワードが無効、または有効期限切れです。</div>
        <label for="password">パスワードが必要です。ご連絡いただければお知らせします。</label>
        <input id="password" name="password" required>
        <button type="submit">送信</button>
      </form>
    `));
  }

  // 有効なパスワードならCookieセット(2週間)
  const twoWeeks = 14 * 24 * 60 * 60; // 秒数
  setCookie(c, COOKIE_NAME, status.password, { path: '/', maxAge: twoWeeks, httpOnly: true });
  return c.redirect('/');
});



app.get('/', async (c) => {
  const { DB } = c.env;
  const stmt = DB.prepare('SELECT markdown, created_at FROM resumes ORDER BY created_at DESC LIMIT 1');
  const { results } = await stmt.all();
  const {markdown, created_at: createdAt} = results[0] as { markdown: string, created_at: string };
  const markdownHTML = marked.parse(markdown as string)

  const formattedDate = new Date(createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return c.html(html(`
    <main>
      <button onclick="window.print()" class="no-print">Download as PDF</button>
      <button onclick="location.href='raw'" class="no-print">Download as Markdown</button>
      <h1>職務経歴書</h1>
        <div class="grid-container">
          <span>氏名</span>
          <span>立花 優斗</span>
          <span>更新日</span>
          <span>${formattedDate}</span>
        </div>
      ${markdownHTML}
    </main>
`))
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
