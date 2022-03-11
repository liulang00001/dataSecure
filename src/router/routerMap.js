/* Layout */
import Layout from '@/views/layout/Layout';

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/

// 框架外的静态页面
export const constantRouterMap = [
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/global',
    component: Layout,
    name: 'global',
    meta: { title: 'global', icon: 'bug' },
    children: [
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/global/management/fintechDomain'),
        meta: { title: 'management', icon: 'chart' }
      }
    ]
  },
  {
    path: '/query',
    component: Layout,
    name: 'query',
    meta: { title: 'query', icon: 'drag' },
    children: [
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/query/management/queryOrderConfig'),
        meta: { title: 'management', icon: 'cms' }
      },
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/query/management/queryOrderRelevance'),
        meta: { title: 'management', icon: 'cms' }
      },
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/query/management/querySource'),
        meta: { title: 'management', icon: 'cms' }
      },
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/query/management/queryTemplate'),
        meta: { title: 'management', icon: 'cms' }
      }
    ]
  },
  {
    path: '/secure',
    component: Layout,
    name: 'secure',
    meta: { title: 'secure', icon: 'drag' },
    children: [
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/secure/management/secureCategory'),
        meta: { title: 'management', icon: 'cms' }
      },
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/secure/management/secureExclusiveTable'),
        meta: { title: 'management', icon: 'cms' }
      },
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/secure/management/secureField'),
        meta: { title: 'management', icon: 'cms' }
      },
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/secure/management/secureLevel'),
        meta: { title: 'management', icon: 'cms' }
      },
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/secure/management/secureScanSource'),
        meta: { title: 'management', icon: 'cms' }
      }
    ]
  }
];

// 动态路由页面
export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true },
];
