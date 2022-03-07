import { SET_MICRO_CURRENT_ROUTER_PATH, SET_MICRO_CURRENT_HEADER_MENU_CODE } from '../mutationTypes';

const microApp = {
  state: {
    currentRouterPath: '',
    currentHeaderMenuCode: '',
  },
  mutations: {
    [SET_MICRO_CURRENT_ROUTER_PATH](state, path) {
      if (state.currentRouterPath !== path) {
        state.currentRouterPath = path;
      }
    },
    [SET_MICRO_CURRENT_HEADER_MENU_CODE](state, menuCode) {
      if (state.currentHeaderMenuCode !== menuCode) {
        state.currentHeaderMenuCode = menuCode;
      }
    }
  }
};

export default microApp;
