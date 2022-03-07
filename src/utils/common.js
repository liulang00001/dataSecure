/* eslint-disable */
import moment from 'moment'
import string from './util.string'
import store from '@/store';

const Util = {
  string
};

(function (util) {
  // format millsecond UTC Time to local with format  YYYY-MM-DD HH:mm:ss
  const formatTime = function (time, formatStr, timezoneOffset) {
    if (!formatStr) {
      formatStr = 'YYYY-MM-DD HH:mm:ss'
    }
    if (!!time) {
      const unixTime = parseInt(time, 10) / 1000
      //console.log("store.timeZone=" + store.getters.timeZone)
      if (timezoneOffset || store.getters.timeZone) {
        return moment.unix(unixTime).utcOffset(parseInt(timezoneOffset || store.getters.timeZone)).format(formatStr)
      } else {
        return moment.unix(unixTime).local().format(formatStr)
      }
    } else {
      return '/'
    }
  }

  // format Time to UTCTime millsecond
  const toUTCTime = function (time, timezoneOffset) {
    // console.log('------------------------------------');
    // console.log('toUTCTime', time, timezoneOffset);
    let utcTime;
    if (timezoneOffset || store.getters.timeZone) {
      let sysOffset = moment().utcOffset()
      let diffTime = sysOffset - parseInt(timezoneOffset || store.getters.timeZone)
      // console.log('toUTCTime.sysOffset', sysOffset);
      utcTime = moment(time).add(diffTime, 'm').utc().valueOf()
    } else {
      utcTime = moment(time).utc().valueOf()
    }
    // console.log('toUTCTime.result', utcTime);
    // console.log('------------------------------------');
    return utcTime;
  }

  const toLocalTime = (time) => this.formatTime(time)

  //对象是否没有定义或为null
  const IsNullOrUndefined = function (obj) {
    if (obj === undefined || obj === null)
      return true;
    return false;
  }

  //当天起始时间
  const toStartUTCTimeOfDay = function (time) {
    let dealTime = moment(time);
    if (IsNullOrUndefined(dealTime))
      return dealTime;
    return toUTCTime(dealTime.hours(0).minutes(0).seconds(0).milliseconds(0));
  }

  //当天最后时间
  const toLastUTCTimeOfDay = function (time) {
    let dealTime = moment(time);
    if (IsNullOrUndefined(dealTime))
      return dealTime;
    return toUTCTime(dealTime.hours(23).minutes(59).seconds(59).milliseconds(999));
  }

  const wrapNullObject = function (data) {
    if (IsNullOrUndefined(data)) {
      console.log("wrap null object")
      data = {}
    }
    return data;
  }

  /**
   * assign target from source depending on a mapping object.
   * ★ why using this? we can use this to assign our data with api response, it means we can decide names of properties, no need to change them the same with response data for using Object.assign
   * and simply change the mapping when value's name of api response changed
   *
   * @param {*} target the object you want to assign, usually a data in template.
   * @param {*} source usually a response of api.
   * @param {*} mapping a key-value map object, keys are from source properties, values are from target properties.
   * @param {*} reverseMapping if you wanna swap position of target and source, then set this parameter as true
   * @returns assigned target
   */
  const mapAssign = function (target, source, mapping, reverseMapping) {
    if (IsNullOrUndefined(source))
      return target;
    else if (IsNullOrUndefined(target))
      return source;

    for (const key in mapping) {
      let sourceKey = reverseMapping ? mapping[key] : key;
      let targetKey = reverseMapping ? key : mapping[key];

      // console.log('--------')
      // console.log('sourceKey', sourceKey);
      // console.log('targetKey', targetKey);

      // source must contains source key
      if (source.hasOwnProperty(sourceKey)) {
        // target value can be created in runtime.
        target[targetKey] = source[sourceKey];
      }
    }
    // console.log('--------')
    return target;
  }

  const formatNumber = function (val, fractionalPartLength) {
    if (!val)
      return "";

    let fpLength = 0;
    if (fractionalPartLength && fractionalPartLength > 0)
      fpLength = fractionalPartLength;

    let strVal = "" + val;
    let indexOfDot = strVal.indexOf('.');
    if (fpLength) {
      if (indexOfDot < 0) {
        return val;
      } else {
        strVal = strVal.substring(0, indexOfDot + fpLength + 1);
        if (indexOfDot == 0)
          return '0' + strVal;
        else
          return strVal;
      }
    } else {
      if (indexOfDot < 0) {
        return val;
      } else {
        strVal = strVal.substring(0, indexOfDot);
        if (indexOfDot == 0)
          return '0';
        else
          return strVal;
      }
    }
  }

  const parseNumber = function (value) {
    if (value == null || isNaN(value))
      return;
    return parseFloat(value);
  }

  const localeCompareSupportsLocales = function() {
    try {
      'foo'.localeCompare('bar', 'i');
    } catch (e) {
      return e.name === 'RangeError';
    }
    return false;
  }

  util.formatTime = formatTime;
  util.toUTCTime = toUTCTime;
  util.toLocalTime = toLocalTime;
  util.IsNullOrUndefined = IsNullOrUndefined;
  util.toStartUTCTimeOfDay = toStartUTCTimeOfDay;
  util.toLastUTCTimeOfDay = toLastUTCTimeOfDay;
  util.wrapNullObject = wrapNullObject;
  util.mapAssign = mapAssign;
  util.formatNumber = formatNumber;
  util.parseNumber = parseNumber;
  util.localeCompareSupportsLocales = localeCompareSupportsLocales;
}(Util))

export default Util
