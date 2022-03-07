import config from '@/config/config';
import platformAdapter from '@/utils/util.platformAdapter';
// 金额格式化
import currencyFormatter from './currency-formatter';
import store from '@/store';

const string = {};

/**
 * 在状态数组中找到某个状态对应的描述
 * @param {*} optionList 状态列表，每项包含(value和label)
 * @param {*} value 具体值
 * @return 返回当前值对应的描述
 */
export function mappingState(optionList, value) {
  let result = '';
  if (!optionList || !Array.isArray(optionList)) {
    return result;
  }

  const state = optionList.filter((item) =>
    item.value === value
  );

  if (state.length > 0) {
    result = state[0].label;
  }
  return result;
}

// 在状态组中找到某个状态的对象
export function mappingItem(optionList, value) {
  if (!optionList || !Array.isArray(optionList)) {
    return undefined;
  }

  const state = optionList.filter((item) =>
    item.value === value
  );

  if (state.length > 0) {
    return state[0];
  }
  return undefined;
}

/**
 * 字符串格式化
 */

String.prototype.format = function(args) {
  const e = arguments;
  return !!this && this.replace(/\{(\d+)\}/g, function(t, r) {
    return e[r] ? e[r] : t;
  });
};

export function betterDisplay(value, defaultVal) {
  if (!defaultVal) {
    defaultVal = config.null;
  }
  return (value || value === 0) ? value : defaultVal;
}

function getUnits(cnt, key) {
  const val = parseInt(cnt);
  if (val) {
    if (val > 1) {
      return val + ' ' + store.vue.$t(key ? key + 's' : 'common.units');
    } else {
      return val + ' ' + store.vue.$t(key || 'common.unit');
    }
  } else {
    return cnt;
  }
}

/**
 * 字符串排序，这个排序不对数据的格式进行校验，这样便于问题排查。因为这个函数只支持String排序
 * @param {*} data 排序数组
 * @param {*} language 当前语言
 * @param {*} sortKey 排序的字段
 */
function sortByString(data, language, sortKey) {
  if (!data || !Array.isArray(data) || !data.length) {
    return;
  }

  if (platformAdapter.localeCompareSupportsLocales() === true) {
    let curLanguage = language || 'en';
    if (curLanguage === 'cn') {
      curLanguage = 'zh';
    }

    data.sort(function(left, right) {
      let leftVal = sortKey && (left[sortKey] !== undefined) ? left[sortKey] : left;
      const rightVal = sortKey && (right[sortKey] !== undefined) ? right[sortKey] : right;
      if (!leftVal || typeof leftVal !== 'string') {
        leftVal = '';
      }
      return leftVal.localeCompare(rightVal, curLanguage);
    });
  } else {
    data.sort(function(left, right) {
      let leftVal = sortKey && (left[sortKey] !== undefined) ? left[sortKey] : left;
      let rightVal = sortKey && (right[sortKey] !== undefined) ? right[sortKey] : right;

      if (!leftVal || typeof leftVal !== 'string') {
        leftVal = '';
      }

      if (!rightVal || typeof rightVal !== 'string') {
        rightVal = '';
      }

      leftVal = leftVal.toUpperCase();
      rightVal = rightVal.toUpperCase();
      if (leftVal < rightVal) {
        return -1;
      } else if (leftVal === rightVal) {
        return 0;
      } else {
        return 1;
      }
    });
  }
  return data;
}

// 计算字符宽度
function calcText(text, el, font) {
  var result = {};
  var span = calcText.fakeEl;
  if (!span) {
    span = document.createElement('span');
    span.style.display = 'inline-block';
    document.body.appendChild(span);
    calcText.fakeEl = span;
  }

  span.style.font = font || el.style.font;

  const textVal = (text || (el ? (el.value || el.innerText || el.placeholder) : ''));

  if (typeof span.textContent !== 'undefined') {
    span.textContent = textVal;
  } else {
    span.innerText = textVal;
  }
  result.width = parseFloat(window.getComputedStyle(span).width);
  result.height = parseFloat(window.getComputedStyle(span).height);
  console.log('textVal=' + textVal, 'width=' + result.width);
  return result;
}

// 金钱格式化
export function amountFormat(amount, currency, isShowCurrency = false) {
  if (Number.isNaN(Number(amount)) || (!amount && typeof amount !== 'number')) {
    return config.null;
  }

  if (!currency) {
    currency = '';
  }

  const formatRules = (((store.getters.cloudConfig || {}).currencyInfo || {})[currency.toUpperCase()] || {}).format || {};
  let localeCurrency = '';
  if (window.accounting) {
    localeCurrency = window.accounting.format(amount, formatRules);
  } else {
    localeCurrency = currencyFormatter.format(amount, { code: currency, symbol: '' });
  }

  return localeCurrency + (isShowCurrency ? ` ${currency}` : '');
}

/**
 * uri编码
 * encodeURI 和 encodeURIComponent 不会对 !'*)( 等编码
 * 针对以上字符 使用escape编码
 * */
export function rfc3986EncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'*)(]/g, escape);
}

export function numToPercentage(val = '', multiplier = 100000) {
  if (!val) {
    return config.null;
  }
  let m = 0;
  const s1 = val + '';
  const s2 = multiplier + '';
  try { m += s1.indexOf('.') > -1 ? s1.split('.')[1].length : 0; } catch (e) { console.log(e); }
  try { m += s2.indexOf('.') > -1 ? s2.split('.')[1].length : 0; } catch (e) { console.log(e); }
  const precisionVal = Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
  return precisionVal / 1000;
}

// 账户主体
export function getCompanyEntity(companyEntity = '') {
  if (!companyEntity) {
    return config.null;
  }
  const cloudConfig = store.getters.cloudConfig || {};
  const allCompanyEntities = cloudConfig.allCompanyEntities || [];
  const companyEntitiesItem = allCompanyEntities.find(item => item.companyEntity === companyEntity) || {};
  return companyEntitiesItem.companyEntityDesc ? companyEntitiesItem.companyEntityDesc : config.null;
}

string.mappingState = mappingState;
string.mappingItem = mappingItem;
string.betterDisplay = betterDisplay;
string.getUnits = getUnits;
string.sortByString = sortByString;
string.calcText = calcText;
string.amountFormat = amountFormat;
string.rfc3986EncodeURIComponent = rfc3986EncodeURIComponent;
string.numToPercentage = numToPercentage;
string.getCompanyEntity = getCompanyEntity;
export default string;
