import db from '@/utils/db';

const KEY_USER_NAME = 'UserName';

export function getName() {
  return db.getItem(KEY_USER_NAME);
}

export function setName(name) {
  // save the token for 1 year
  return db.setItem(KEY_USER_NAME, name);
}

export function removeName() {
  return db.removeItem(KEY_USER_NAME);
}
