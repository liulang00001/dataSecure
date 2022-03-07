import Vue from 'vue';
import Router from 'vue-router';
import NProgress from '../components/NProgress';
import { constantRouterMap } from './routerMap';
import routeControl from './routeControl';

Vue.use(Router);

const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  console.log('router from: ' + from.path + ', to: ' + to.path);
  console.log('from: ', from);
  console.log('to: ', to);

  routeControl.integrateI18n(to).then(result => {
    routeControl.checkPermissionAndGo(to, from, next);
  });
});

router.afterEach(to => {
  NProgress.done();
});

export default router;