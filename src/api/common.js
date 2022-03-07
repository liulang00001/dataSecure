import { post, upload } from '@/utils/simpleRequest';
/**
 *个人会员信息查询
 *
 * @export
 * @param {*} data
 * @returns
 */
export function memberInfo(data) {
  return post('/member/get/v1', data, { hostType: 'COMMON' });
}

/**
 *UPI用户查询 TODO:update request url
 *
 * @export
 * @param {*} data
 * @returns
 */
export function upiUserSearch(data) {
  return post('/upi/user/list/v1', data, { hostType: 'COMMON' });
}

/**
 *支付订单查询  TODO:update request url
 *
 * @export
 * @param {*} data
 * @returns
 */
export function productManageMent(data) {
  return post('', data, { hostType: 'COMMON' });
}

/**
 * 获取支付方式列表/角色
 */
export function sendCloudConfigReq(data) {
  return post('/common/getCommonElements', data);
}

// 字段表查询
export function getDictInfo(dictCode, version = '1.0.0') {
  return post('/common/getDictInfo', {
    dictCode,
    version,
  }, { hostType: 'NEW_COMMON' });
}

// 商户类型
// 字段表查询
export function getDictInfos(dictCode, version = '1.0.1') {
  return post('/common/getDictInfo', {
    dictCode,
    version,
  }, { hostType: 'NEW_COMMON' });
}

// 根据ShareId获取用户相关角色对应的商务拓展
export function getBDList(data = {}) {
  return post('/user/getBusinesExpansion', data, { hostType: 'NEW_COMMON' });
}

// 获取操作日志通用接口
export function findActionLogListApi(data = {}, config = {}) {
  return post('/common/findActionLogList', data, { hostType: 'NEW_COMMON', needIdempotent: config.needIdempotent, });
}

export function userBasicInfo(data = {}) {
  return post('/user/info', data, { hostType: 'NEW_COMMON' });
}

// 通用上传接口
export function uploadApi(option) {
  option.data = option.data || {};
  const type = option.data.type;
  option.data.type = type === undefined ? -1 : type;
  return upload('/common/upload', option);
}
