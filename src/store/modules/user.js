import { loginByUsername, logout, getUserInfo, getUserPermissions } from '@/api/login';
import { removeToken } from '@/utils/auth';
import { setName, removeName } from '@/utils/user';
import { sendCloudConfigReq, getBDList, userBasicInfo } from '@/api/common';
import { SET_CODE, SET_TOKEN, SET_INTRODUCTION, SET_SETTING, SET_STATUS, SET_NAME, SET_AVATAR, SET_ROLES, SET_PERMISSIONS, SET_CLOUD_CONFIG } from '../mutationTypes';
import db from '@/utils/db';
import i18n from '@/lang';
import { removeCookie } from '@/utils/cookies';

let isLogouting = false;
import stringUtils from '../../utils/util.string';

const KEY_CLOUD_CONFIG = 'cloudConfig';
const TAG = '[store-user]';

function _mergeCountry_Currency(countryInfoList) {
  if (!countryInfoList || !countryInfoList.length) return;
  const dictionary = {};
  const locale = {
    zh: {
      countryList: [],
      currencyList: [],
    },
    en: {
      countryList: [],
      currencyList: [],
    }
  };
  countryInfoList.forEach(item => {
    // 国家列表
    locale.zh.countryList.push({
      value: item.countryCode,
      label: item.chName
    });
    locale.en.countryList.push({
      value: item.countryCode,
      label: item.enName
    });
    // 币种列表  去重
    if (item.currency && item.currency.length) {
      item.currency.forEach(currency => {
        if (currency.code && !dictionary[currency.code]) {
          locale.zh.currencyList.push({
            value: currency.code,
            label: currency.chName || currency.code,
            pinyin: currency.pinyin,
          });
          locale.en.currencyList.push({
            value: currency.code,
            label: currency.enName || currency.code,
            pinyin: currency.pinyin,
          });
          dictionary[currency.code] = true;
        }
      });
    }
  });
  // 币种按拼音排序
  locale.zh.currencyList.sort((a, b) => {
    if (a.pinyin < b.pinyin) {
      return -1;
    }
    if (a.pinyin > b.pinyin) {
      return 1;
    }
    return 0;
  });
  locale.en.currencyList.sort((a, b) => {
    if (a.pinyin < b.pinyin) {
      return -1;
    }
    if (a.pinyin > b.pinyin) {
      return 1;
    }
    return 0;
  });

  i18n.mergeLocaleMessage('zh', locale.zh);
  i18n.mergeLocaleMessage('en', locale.en);
  console.log('_mergeCurrencyI18n', i18n);
}

function _mergeTimezoneI18n(timeZoneInfoList) {
  if (!timeZoneInfoList || !timeZoneInfoList.length) return;
  const locale = {
    zh: {
      countryTimezone: []
    },
    en: {
      countryTimezone: []
    }
  };
  // utc 时间要放在第一位，单独拿出来，排序后再unshift
  const utc = {
    zh: null,
    en: null
  };
  // 国家时区列表  追加拼音
  timeZoneInfoList.forEach(item => {
    if (item.countryCode == 'UTC') {
      utc.zh = {
        city: item.chCity,
        name: item.chName,
        countryCode: item.countryCode,
        offset: item.offset,
        show: item.show,
        timeZoneValue: item.timeZoneValue,
        zoneName: item.zoneName,
        pinyin: item.pinyin
      };
      utc.en = {
        city: item.enCity,
        name: item.enName,
        countryCode: item.countryCode,
        offset: item.offset,
        show: item.show,
        timeZoneValue: item.timeZoneValue,
        zoneName: item.zoneName,
        pinyin: item.pinyin
      };
    } else {
      locale.zh.countryTimezone.push({
        city: item.chCity,
        name: item.chName,
        countryCode: item.countryCode,
        offset: item.offset,
        show: item.show,
        timeZoneValue: item.timeZoneValue,
        zoneName: item.zoneName,
        pinyin: item.pinyin
      });
      locale.en.countryTimezone.push({
        city: item.enCity,
        name: item.enName,
        countryCode: item.countryCode,
        offset: item.offset,
        show: item.show,
        timeZoneValue: item.timeZoneValue,
        zoneName: item.zoneName,
        pinyin: item.pinyin
      });
    }
  });

  // 根据城市名称对时区排序
  stringUtils.sortByString(locale.zh.countryTimezone, 'zh', 'city');
  stringUtils.sortByString(locale.en.countryTimezone, 'en', 'city');
  // 头部插入utc时区
  utc.zh && locale.zh.countryTimezone.unshift(utc.zh);
  utc.en && locale.en.countryTimezone.unshift(utc.en);

  i18n.mergeLocaleMessage('zh', locale.zh);
  i18n.mergeLocaleMessage('en', locale.en);
  console.log('_mergeTimezoneI18n', i18n);
}

function _mergeCompanyEntity(companyEntityList) {
  if (!companyEntityList || companyEntityList.length === 0) {
    return;
  }
  const locale = {
    zh: {
      companyEntityList: []
    },
    en: {
      companyEntityList: []
    }
  };
  companyEntityList.forEach((item) => {
    locale.zh.companyEntityList.push({
      value: item.companyEntity,
      label: item.companyEntityDesc
    });
    locale.en.companyEntityList.push({
      value: item.companyEntity,
      label: item.companyEntityDesc
    });
  });
  i18n.mergeLocaleMessage('zh', locale.zh);
  i18n.mergeLocaleMessage('en', locale.en);
}

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: '',
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    permissions: null,
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    [SET_CODE](state, code) {
      state.code = code;
    },
    [SET_TOKEN](state, token) {
      state.token = token;
    },
    [SET_INTRODUCTION](state, introduction) {
      state.introduction = introduction;
    },
    [SET_SETTING](state, setting) {
      state.setting = setting;
    },
    [SET_STATUS](state, status) {
      state.status = status;
    },
    [SET_NAME](state, name) {
      state.name = name;
    },
    [SET_AVATAR](state, avatar) {
      state.avatar = avatar;
    },
    [SET_ROLES](state, roles) {
      state.roles = roles;
    },
    [SET_PERMISSIONS](state, permissions) {
      state.permissions = permissions;
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data;
          // console.log('received token', data.token)
          // const token = data.token || ''
          console.log('received token', data.data);
          const token = data.data || '';
          commit(SET_TOKEN, token);
          commit(SET_NAME, username);
          // setToken(token);
          setName(username);
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    // deprecated
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error');
          }
          const data = response.data;
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit(SET_ROLES, data.roles);
          } else {
            reject('getInfo: roles must be a non-null array !');
          }

          commit(SET_NAME, data.name);
          commit(SET_AVATAR, data.avatar);
          commit(SET_INTRODUCTION, data.introduction);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise(resolve => {
		if (!isLogouting) {
        	isLogouting = true;
	        logout(state.token).then(() => {
	          removeToken();
	          removeCookie();
	          removeName();
	          commit(SET_TOKEN, '');
	          commit(SET_NAME, '');
	          commit(SET_ROLES, []);
	        }).catch(error => {
	          removeToken();
	          removeCookie();
	          removeName();
	          commit(SET_TOKEN, '');
	          commit(SET_NAME, '');
	          commit(SET_ROLES, []);
	        }).finally(() => {
	            resolve();
	            isLogouting = false;
	        });
		} else {
          resolve();
        }
      });
    },

    // 前端 登出
    // @Deprecated
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit(SET_TOKEN, '');
        removeToken();
        removeCookie();
        commit(SET_NAME, '');
        removeName();
        resolve();
      });
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit(SET_TOKEN, role);
        // setToken(role);
        getUserInfo(role).then(response => {
          const data = response.data;
          commit(SET_ROLES, data.roles);
          commit(SET_NAME, data.name);
          commit(SET_AVATAR, data.avatar);
          commit(SET_INTRODUCTION, data.introduction);
          resolve();
        });
      });
    },
    // 请求权限
    GetUserPermissions({ commit }) {
      return new Promise(resolve => {
        getUserPermissions().then(response => {
          const data = response.data;
          if (data && data.data) {
            commit(SET_PERMISSIONS, data.data);
          } else {
            commit(SET_PERMISSIONS, Object.assign({}, []));
          }
          commit(SET_AVATAR, 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif');
          resolve(data);
        }).catch(err => {
          commit(SET_PERMISSIONS, Object.assign({}, []));
          commit(SET_AVATAR, 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif');
          resolve({});
          console.log('GetUserPermissions', JSON.stringify(err));
        });
      });
    },
    // 获取用户基本信息
    userBasicInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        userBasicInfo().then(response => {
          const data = (response.data || {}).data || {};
          commit(SET_NAME, data.uid);
          commit("SET_LANGUAGE", data.language || 'zh', {root: true});
          setName(data.uid);
        }).catch(error => {
          reject(error);
        });
      })
    },
    getCloudConfig({ commit }) {
      // 获取商务拓展
      getBDList().then(res => {
        const resData = (res.data || {}).data || [];
        let cloudConfig = db.getItem(KEY_CLOUD_CONFIG) || {};
        cloudConfig = Object.assign({}, cloudConfig, {
          bdList: resData,
        });
        commit(SET_CLOUD_CONFIG, cloudConfig);
      }).catch(error => {
        console.log(TAG, 'cloudConfig error: ', error);
      });
      // 获取支付方式及角色
      return sendCloudConfigReq().then(res => {
        const resData = (res.data || {}).data || {};
        let cloudConfig = db.getItem(KEY_CLOUD_CONFIG) || {};
        function filterPay(list) {
          const arr = [];
          if (Array.isArray(list)) {
            list.forEach(pay => {
              const subMethodList = pay.subMethodList || [];
              pay.subMethodList = subMethodList.filter(item => item.methodSubCode != pay.methodCode && item.subDisplayName);
              const obj = arr.find(item => item.countryCode == pay.countryCode);
              if (obj) {
                const payItem = obj.methodList.find(item => !item.bizProductCode.includes(pay.bizProductCode));
                if (payItem) {
                  payItem.bizProductCode.push(pay.bizProductCode);
                } else {
                  pay.bizProductCode = [pay.bizProductCode];
                  obj.methodList.push(pay);
                }
              } else {
                pay.bizProductCode = [pay.bizProductCode];
                arr.push({
                  countryCode: pay.countryCode,
                  methodList: [pay]
                });
              }
            });
          }
          return arr;
        }
        const payTypeObj = {
          receipt: filterPay(resData.receiptPayTypes || []), // 标准收款
          payment: filterPay(resData.paymentPayTypes || []), // 标准付款
          recharge: filterPay(resData.topupReceiptPayTypes || []), // 充值站
        };
        cloudConfig = Object.assign({}, cloudConfig, {
          payTypes: payTypeObj,
          roles: resData.roles || [],
          // type: 0 入，1 出
          channelConfigs: (resData.channelCodeInfo || []).map(item => {
            item.cnName += item.type ? '(Disbursement)' : '(Payment)';
            item.enName += item.type ? '(Disbursement)' : '(Payment)';
            return item;
          }),
          countriesInfo: resData.countryInfoList || [],
          timeZoneInfoList: resData.timeZoneInfoList || [],
          currencyInfo: resData.currencyInfo || {},
          topupSeqType: resData.topupCdkeyType || [],
          allCompanyEntities: resData.allCompanyEntities || []
        });
        // console.log(TAG, 'cloudConfig: ' + JSON.stringify(cloudConfig));
        _mergeCountry_Currency(cloudConfig.countriesInfo);
        _mergeTimezoneI18n(cloudConfig.timeZoneInfoList);
        _mergeCompanyEntity(resData.allCompanyEntities);
        commit(SET_CLOUD_CONFIG, cloudConfig);
      }).catch(error => {
        console.log(TAG, 'cloudConfig, error: ', error);
      });
    }
  }
};

export default user;
