export async function getPasswordStatus(DB: D1Database) {
  const stmt = DB.prepare('SELECT password, expires_at, disabled FROM passwords ORDER BY ROWID DESC LIMIT 1');
  const { results } = await stmt.all();
  if (!results || results.length === 0) {
    return { disabled: true, valid: false, reason: 'No password record found' };
  }
  const { password, expires_at, disabled } = results[0] as { password: string, expires_at: string, disabled: boolean };

  const now = new Date();
  const expired = new Date(expires_at) < now;

  return {
    disabled,
    password,
    expired,
  };
}
