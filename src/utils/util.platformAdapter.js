const platformAdapter = {};
platformAdapter.localeCompareSupportsLocales = function() {
  try {
    'foo'.localeCompare('bar', 'i');
  } catch (e) {
    return e.name === 'RangeError';
  }
  return false;
};

export default platformAdapter;