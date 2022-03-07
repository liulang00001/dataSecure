import db from '@/utils/db';
import { TOGGLE_SIDEBAR, CLOSE_SIDEBAR, TOGGLE_DEVICE, SET_LANGUAGE, SET_TIME_ZONE, SET_CLOUD_CONFIG } from '../mutationTypes';
const KEY_CLOUD_CONFIG = 'cloudConfig';

const app = {
  state: {
    sidebar: {
      opened: !+db.getItem('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    language: db.getItem('language') || 'zh',
    timeZone: db.getItem('timeZone'),
    timeZoneName: db.getItem('timeZoneName'),
    cloudConfig: db.getItem(KEY_CLOUD_CONFIG),
    someVal: 0
  },
  mutations: {
    [TOGGLE_SIDEBAR](state) {
      if (state.sidebar.opened) {
        db.setItem('sidebarStatus', 1);
      } else {
        db.setItem('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    [CLOSE_SIDEBAR](state, withoutAnimation) {
      db.setItem('sidebarStatus', 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    [TOGGLE_DEVICE](state, device) {
      state.device = device;
    },
    [SET_LANGUAGE](state, language) {
      state.language = language;
      db.setItem('language', language);
    },
    [SET_TIME_ZONE](state, obj) {
      state.timeZone = obj.timezone;
      state.timeZoneName = obj.zoneName;
      db.setItem('timeZone', obj.timezone);
      db.setItem('timeZoneName', obj.zoneName);
    },
    [SET_CLOUD_CONFIG](state, cloudConfig) {
      state.cloudConfig = cloudConfig;
      db.setItem(KEY_CLOUD_CONFIG, cloudConfig);
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit(TOGGLE_SIDEBAR);
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit(CLOSE_SIDEBAR, withoutAnimation);
    },
    toggleDevice({ commit }, device) {
      commit(TOGGLE_DEVICE, device);
    },
    setLanguage({ commit }, language) {
      commit(SET_LANGUAGE, language);
    },
    setTimeZone({ commit }, obj) {
      commit(SET_TIME_ZONE, obj);
    }
  }
};

export default app;
