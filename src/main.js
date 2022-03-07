import Vue from 'vue';

import 'normalize.css/normalize.css';// A modern alternative to CSS resets

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss'; // global css

import App from './App';
import router from './router';
import store from './store';

import i18n from './lang'; // Internationalization
import './icons'; // icon
import './errorLog';// error log

import './directive/index';

import './components/index';
import './utils/global';
import { SET_MICRO_CURRENT_ROUTER_PATH } from '@/store/mutationTypes';

import TreeView from 'vue-json-tree-view';
Vue.use(TreeView);

import * as filters from './filters';

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

function updateGlobalData(data, key) {
  if (key === 'language') {
    store.vue.$i18n.locale = data.value;
  }
  if (key === 'sidebarOpened') {
    if (data.value !== store.vue.$store.getters.sidebar.opened) {
      store.vue.$store.commit(data.command);
    }
    return;
  }
  if (key === 'routerInfo') {
    const value = data.value || {};
    if (store.sysCode === value.sysCode && store.vue.currentRouterPath !== value.path) {
      const router = {
        path: data.value.path,
      };
      if (value.query) {
        router.query = value.query;
      }
      store.vue.$router.push(router);
    }
    return;
  }
  store.vue.$store.commit(data.command, data.value || '');
}
function render(props = {}) {
  const { container, sysCode } = props;
  const masterStore = props.store;
  if (masterStore) {
    store.getters.isQiankun = masterStore.getters && masterStore.getters.isQiankun || false;
    store.loginUrl = masterStore.loginUrl;
  }
  store.sysCode = sysCode;
  store.vue = new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
    computed: {
      currentRouterPath() {
        return this.$store.state.microApp.currentRouterPath;
      },
    },
    methods: {
      syncLangToMaster(router) {
        const name = router.meta && router.meta.title || router.name;
        if (masterStore && name) {
          const key = `route.${name}`;
          masterStore.commit('SET_MICRO_ROUTER_LANG', {
            sysCode,
            path: this.$route.path,
            lang: {
              defaultLang: this.$t(key, 'zh'),
              zh: this.$t(key, 'zh'),
              en: this.$t(key, 'en'),
            },
          });
        }
      },
    },
    watch: {
      $route(router) {
        this.$store.commit(SET_MICRO_CURRENT_ROUTER_PATH, router.fullPath);
        this.syncLangToMaster(router);
      }
    },
    mounted() {
      const router = this.$route;
      this.syncLangToMaster(router);
    }
  });
  store.vue.$mount(container ? container.querySelector('#micro-app') : '#micro-app');
  // 为了避免根id#app与其他DOM冲突，需要限制查找范围
  if (props.onGlobalStateChange) {
    props.onGlobalStateChange((state, prevState) => {
      Object.keys(state).find(key => {
        updateGlobalData(state[key], key);
      });
    }, true);
  }
  Vue.prototype.$jumpToMicroSystem = (params) => {
    if (masterStore) {
      masterStore.commit('SET_MICRO_ROUTE_JUMP', {
        menuCode: store.state.microApp.currentHeaderMenuCode,
        sysCode: params.sysCode,
        path: params.path,
        query: params.query,
      });
    }
  };
  if (masterStore) {
    Vue.prototype.$closeTagView = (path) => {
      masterStore.commit('CLOSE_MICRO_ROUTE', {
        path,
        sysCode: store.sysCode,
      });
    };
  }
}

if (!window.__POWERED_BY_QIANKUN__) {
  require('particles.js');
  render();
}

// --------- 生命周期函数------------
export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);
}
export async function unmount() {
  store.vue.$destroy();
  store.vue.$el.innerHTML = '';
  store.vue = null;
}
