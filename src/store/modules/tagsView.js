import {
  ADD_VISITED_VIEWS,
  DEL_VISITED_VIEWS,
  ADD_CACHED_VIEWS,
  DEL_CACHED_VIEWS,
  DEL_OTHERS_VIEWS,
  DEL_ALL_VIEWS,
} from '../mutationTypes';
import db from '@/utils/db';

const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: [],
  },
  mutations: {
    [ADD_VISITED_VIEWS](state, view) {
      const index = state.visitedViews.findIndex(v => v.path === view.path);
      const currentView = Object.assign({}, view, { title: view.meta.title || 'no-name' });
      if (index >= 0) {
        state.visitedViews.splice(index, 1, currentView);
      } else {
        state.visitedViews.push(Object.assign({}, view, currentView));
      }
    },
    [DEL_VISITED_VIEWS](state, view) {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1);
          break;
        }
      }
      // if (view && view.path == '/merchantService/createMerchant') {
      //   db.removeItem('merchant_Info');
      //   db.removeItem('merchant_Step');
      //   db.removeItem('merchant_Portal');
      //   db.removeItem('merchant_MerDetail');
      //   db.removeItem('merchant_MemDetail');
      // }
      if (view && view.name === 'merchantAccountCreate') { 
        db.removeItem('merchant_create_step');
        db.removeItem('merchant_create_cache');
      }
    },
    [ADD_CACHED_VIEWS](state, view) {
      let midView = [];
      if(view.matched.length > 2) {
        let index = view.matched.findIndex(item => item.name == view.name);
        for(let i = 1; i < index; i++) {
          midView.push(view.matched[i].name);
        }
      }
      if (!state.cachedViews.find(v => v === view.name)) {
        if (!view.meta || !view.meta.noCache) {
          midView.forEach(item => {
            if(!state.cachedViews.includes(item)) {
              state.cachedViews.push(item);
            }
          });
          state.cachedViews.push(view.name);
        }
      }
    },
    [DEL_CACHED_VIEWS](state, view) {
      for (const [i, v] of state.cachedViews.entries()) {
        if (v === view.name) {
          state.cachedViews.splice(i, 1);
          break;
        }
      }
    },
    [DEL_OTHERS_VIEWS](state, view) {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1);
          break;
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i);
          state.cachedViews = state.cachedViews.slice(index, i + 1);
          break;
        }
      }
    },
    [DEL_ALL_VIEWS](state) {
      state.visitedViews = [];
      state.cachedViews = [];
    }
  },
  actions: {
    addVisitedViews({ commit }, view) {
      commit(ADD_VISITED_VIEWS, view);
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit(DEL_VISITED_VIEWS, view);
        resolve([...state.visitedViews]);
      });
    },
    addCachedViews({ commit }, view) {
      commit(ADD_CACHED_VIEWS, view);
    },
    delCachedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit(DEL_CACHED_VIEWS, view);
        resolve([...state.cachedViews]);
      });
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit(DEL_OTHERS_VIEWS, view);
        resolve([...state.visitedViews]);
      });
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit(DEL_ALL_VIEWS);
        resolve([...state.visitedViews]);
      });
    }
  }
};

export default tagsView;
