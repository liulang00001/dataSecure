import { post, get } from '@/utils/simpleRequest';

export function loginByUsername(shareId, password) {
  const data = {
    shareId,
    password
  };
  return post('/user/login', data, { hostType: 'NEW_COMMON' });
}
// export function loginByUsername(name, pwd) {
//   const data = {
//     pwd,
//     name
//   }
//   return request({
//     url: '/user/login/v1',
//     method: 'post',
//     data
//   })
// }
/**
 *
 *
 * @export
 * @returns
 */
export function logout(token) {
  return get('/user/logout', {}, {
    hostType: 'NEW_UPMS', headers: {
      'X-Token': token
    }
  });
}
/**
 *
 *
 * @export
 * @param {*} token
 * @returns
 */
export function getUserInfo(token) {
  return get('/user/info', { token }, { hostType: 'COMMON' });
}

/**
 * 系统首页，返回当前用户下的所有的菜单权限
 */
export function getUserPermissions() {
  return get('/user/index', {}, { hostType: 'NEW_COMMON' });
}
