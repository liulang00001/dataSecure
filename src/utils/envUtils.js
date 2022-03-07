export function getHostOfShoplay () {
  if (process.env.ENV_CONFIG == 'dev' || process.env.ENV_CONFIG == 'test') {
    return 'https://www-dev.shoplay365.com';
  }
  if (process.env.ENV_CONFIG == 'sit') {
    return 'https://www-pre.shoplay365.com';
  }
  if (process.env.ENV_CONFIG == 'uat') {
    return 'https://www-uat.shoplay365.com';
  }
  if (process.env.ENV_CONFIG == 'prod') {
    return 'https://www.shoplay365.com';
  }
  if (process.env.ENV_CONFIG == 'stress') {
    return 'https://www-test.shoplay365.com';
  }
};

export function getPreviewUrlOfShoplay (country, pageid) {
  return getHostOfShoplay() + '/' + (country || '').toLowerCase() + '/preview?pageid=' + pageid;
};
