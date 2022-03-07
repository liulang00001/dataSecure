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
    path: '/dataSecurityConfig',
    component: Layout,
    name: 'dataSecurityConfig',
    meta: { title: 'dataSecurityConfig', icon: 'bug' },
    children: [
      {
        path: 'fintechDomain',
        name: 'fintechDomain',
        component: () => import('@/views/dataSecurityConfig/fintechDomain/index'),
        meta: { title: 'fintechDomain', icon: 'chart' }
      },

      {
        path: 'secureCategory',
        name: 'secureCategory',
        component: () => import('@/views/dataSecurityConfig/secureCategory/index'),
        meta: { title: 'secureCategory', icon: 'list' }
      },
      {
        path: 'secureExclusiveTable',
        name: 'secureExclusiveTable',
        component: () => import('@/views/dataSecurityConfig/secureExclusiveTable/index'),
        meta: { title: 'secureExclusiveTable', icon: 'risk' }
      },
      {
        path: 'secureField',
        name: 'secureField',
        component: () => import('@/views/dataSecurityConfig/secureField/index'),
        meta: { title: 'secureField', icon: 'star' }
      },
      {
        path: 'secureLevel',
        name: 'secureLevel',
        component: () => import('@/views/dataSecurityConfig/secureLevel/index'),
        meta: { title: 'secureLevel', icon: 'payment' }
      },
      {
        path: 'secureScanSource',
        name: 'secureScanSource',
        component: () => import('@/views/dataSecurityConfig/secureScanSource/index'),
        meta: { title: 'secureScanSource', icon: 'message' }
      },
    ]
  },
  {
    path: '/dataQueryConfig',
    component: Layout,
    name: 'dataQueryConfig',
    meta: { title: 'dataQueryConfig', icon: 'drag' },
    children: [
      {
        path: 'queryCategory',
        name: 'queryCategory',
        component: () => import('@/views/dataQueryConfig/queryCategory/index'),
        meta: { title: 'queryCategory', icon: 'cms' }
      },
      {
        path: 'queryOrderConfig',
        name: 'queryOrderConfig',
        component: () => import('@/views/dataQueryConfig/queryOrderConfig/index'),
        meta: { title: 'queryOrderConfig', icon: 'component' }
      },
      {
        path: 'queryOrderRelevance',
        name: 'queryOrderRelevance',
        component: () => import('@/views/dataQueryConfig/queryOrderRelevance/index'),
        meta: { title: 'queryOrderRelevance', icon: 'edit' }
      },
      {
        path: 'querySource',
        name: 'querySource',
        component: () => import('@/views/dataQueryConfig/querySource/index'),
        meta: { title: 'querySource', icon: 'eye' }
      },
      {
        path: 'queryTemplate',
        name: 'queryTemplate',
        component: () => import('@/views/dataQueryConfig/queryTemplate/index'),
        meta: { title: 'queryTemplate', icon: 'lock' }
      },
    ]
  },
];

// 动态路由页面
export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true },
];
