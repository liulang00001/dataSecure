/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  if (str === null || str === '' || str === undefined) {
    return false;
  }else {
    return true;
  }
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
 // return true;
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/**
 * 验证密码是否符合规则，除包含字母外，还有包含数字或者符号，最少6位
 * @param {*} password
 */
export function validatePassword(password) {
  const regExp = /(?=.*[A-Za-z])((?=.*[0-9])|(?=.*[^A-Za-z0-9])){6,}/;
  return regExp.test(password);
}

/**
 * 是否是数字或者小数（小数保留2位）
 * @param {} val
 */
export function validateDotAndNumber(val) {
  const regExp = /^([1-9]\d*|0)+(\.\d{1,2})?$/;
  return regExp.test(val);
}

/**
 * 是否是数字，不支持000000;
 * @param {*}} val
 */
export function validateNumber(val) {
  const regExp = /^([1-9]\d*|0)$/;
  return regExp.test(val);
}
