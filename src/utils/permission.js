import store from '@/store';

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(permitId) {
  const permissions = store.getters && store.getters.permissions;
  if(permissions) {
    if(!permitId)
      return true;
    for (let i = 0; i < permissions.length; i++) {
      if (permissions[i].permitId === permitId) {
        return true;
      }
    }
    return false;
  }
  else
    return false;
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles 服务器配置的角色列表
 * @param route
 */
export function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    route.meta.roles.some(role => {
      return roles.includes(role);
    });
  } else {
    return false;
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
export function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

/**
 * 通过meta.permissionKey判断是否与当前用户权限匹配
 * 默认是有权限的
 * @param roles
 * @param meta
 */
export function hasPermissionKey(permissions, meta) {
  if (meta && meta.permissionKey) {
    if (permissions && (permissions instanceof Array)) {
      if(Array.isArray(meta.permissionKey)) {
        return permissions.some(perm => meta.permissionKey.some(metaPermKey=> metaPermKey == perm.permitId));
      }
      else
        return permissions.some(perm => meta.permissionKey === perm.permitId);
    } else {
      return false;
    }
  } else {
    return true;
  }
}

/**
 * 递归过滤异步路由表，返回符合用户权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
export function filterAsyncRouterByPermission(asyncRouterMap, permissions) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermissionKey(permissions, route.meta)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouterByPermission(route.children, permissions);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

