import router from './index';
import { MessageBox } from 'element-ui';
import moment from 'moment';
import NProgress from '../components/NProgress'; // progress bar
import { getToken, setToken } from '@/utils/auth'; // getToken from cookie
import { hasPermissionKey } from '@/utils/permission';
import langUtils from '@/utils/langUtils';
import lang from '../lang';
import qs from 'qs';
import store from '@/store';
import { getCookie } from '@/utils/cookies';
// 印度时区
const defaultZone = '330';
const defaultZoneShow = 'Asia/Calcutta';
const whiteList = ['/authredirect'];// no redirect whitelist

async function integrateI18n(to) {
  if (to.meta && to.meta.integratedI18n) {
    return;
  }
  const localePath = (to.meta && to.meta.localePath) || to.path;
  await import(`@/views${localePath}/local.js`).then(data => {
    langUtils.integrateLang(data.default, to);
    if (!to.meta) to.meta = {};
    to.meta.integratedI18n = true;
  }).catch(err => {
    console.log('integrateI18n err=' + err);
  });
}

function checkPermissionAndGo(to, from, next) {
  // const token = store.getters.token || to.query.token || (qs.parse(window.location.href.split('?')[1]) || {}).token || getCookie();
  // console.log('---token[%s]---', token);
  // if (store.getters.token !== token) {
  //   store.commit('SET_TOKEN', token);
  // }
  // if (getCookie() !== token) {
  //   setToken(token);
  // }
  if (getCookie()) { // determine if there has token
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // 不在根据角色来进行权限限制，而是根据服务器返回的权限列表来控制
      if (!store.getters.permissions) {
        store.dispatch('userBasicInfo').then(req => {
          if (req.language) {
            lang.locale = req.language || 'zh';
          }
        }).catch(e => {
          console.error('Get user info error', e);
          logout();
        });
        store.dispatch('getCloudConfig').then(res => {
          // 接口拿到时区后，初始化系统右上角时区选择下拉
          const zoneList = lang.t('countryTimezone');
          if ((!store.getters.timeZone) || !store.getters.timeZoneName) {
            // 根据当前电脑所在时区来初始化
            const localUtcOffset = moment().utcOffset() + '';
            console.log('routerControl localUtcOffset=' + localUtcOffset);
            const timezone = zoneList.find(item => item.offset == localUtcOffset);
            if (timezone) {
              store.dispatch('setTimeZone', {
                timezone: localUtcOffset,
                zoneName: timezone.zoneName
              });
            } else {
              store.dispatch('setTimeZone', {
                timezone: defaultZone,
                zoneName: defaultZoneShow
              });
            }
          }
        });
        store.dispatch('GetUserPermissions').then(res => {
          const permissions = res.data;
          store.dispatch('GenerateRoutesByPermission', { permissions }).then(() => { // 根据roles权限生成可访问的路由表
            console.log('addRoutes ' + store.getters.addRouters.length);
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            const routerConfig = { ...to, replace: true };
            delete routerConfig.query.token;
            next(routerConfig); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          });
        }).catch((e) => {
          console.log('Get user permissions error', e);
          logout();
        });
      } else {
        // console.log('hasPersissionKey ' + to.path)
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermissionKey(store.getters.permissions, to.meta)) {
          next();//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }});
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next();
    } else {
      login();
    }
  }
}
function login() {
  store.dispatch('LogOut').then(() => {
    const loginUrl = store.loginUrl || `${process.env.LOGIN_URL}`;
    console.log('loginUrl', loginUrl);
    window.location.href = loginUrl + `?orgUrl=${window.location.href}`;
    NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
  });
}
let isOnLogout = false;
function logout() {
  if (!store.getters.isQiankun && !isOnLogout) {
    isOnLogout = true;
    store.vue.messageBoxIsActive = true;
    MessageBox.confirm(store.vue.$t('errorCodeList.error502.content'), store.vue.$t('errorCodeList.error502.title'), {
      confirmButtonText: store.vue.$t('errorCodeList.error502.okStr'),
      cancelButtonText: store.vue.$t('errorCodeList.error502.cancelStr'),
      type: 'warning'
    }).then(() => {
      login();
    }).finally(() => {
      store.vue.messageBoxIsActive = false;
      isOnLogout = false;
    });
  }
}

const routeControl = {
  integrateI18n,
  checkPermissionAndGo
};
export default routeControl;
