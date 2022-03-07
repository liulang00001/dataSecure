import { asyncRouterMap, constantRouterMap } from '@/router/routerMap';
import { filterAsyncRouter, filterAsyncRouterByPermission } from '@/utils/permission';
import { SET_ROUTERS } from '../mutationTypes';

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    [SET_ROUTERS](state, routers) {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data;
        let accessedRouters;
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap;
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
        }
        commit(SET_ROUTERS, accessedRouters);
        resolve();
      });
    },
    GenerateRoutesByPermission({ commit }, data) {
      return new Promise(resolve => {
        const { permissions } = data;
        const accessedRouters = filterAsyncRouterByPermission(asyncRouterMap, permissions);
        commit(SET_ROUTERS, accessedRouters);
        resolve();
      });
    }
  }
};

export default permission;
