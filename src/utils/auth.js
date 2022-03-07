import db from '@/utils/db';

const TokenKey = 'Admin-Token';

export function getToken() {
  const val = db.getItem(TokenKey);
  return val;
}

export function setToken(token) {
  // save the token for 1 year
  return db.setItem(TokenKey, token);
}

export function removeToken() {
  return db.removeItem(TokenKey);
}
