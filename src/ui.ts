import { styles } from './style';

export const html = (body: string) => `
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <title>立花優斗の職務経歴書</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>📚</text></svg>">
    <style>
      ${styles}
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>
`
