const host = require('../../config/host');

const UPLOAD_URL = {
  COMMON: 'aws/upload',
  BILL_FLOW: 'reconciliation/getChkFile',
  RECON_BANK: 'recon/uploadCheckFile',
  // PAY_REQUEST: 'payment/addPayOrderFromCsv',
  PAY_REQUEST: 'payment/upload',
  CONTRACT: 'contract/upload',
  ACCOUNT_RECEIPT: 'account/receiptUpload',
  MEMBER: 'member/upload'
};

const DOWNLOAD_URL = {
  // PAY_APPROVE_LIST: 'excelService/approve/list/downLoad'
  PAY_APPROVE_LIST: 'payment/approvalDetailDownload',
  COUPON_TEMPLETE_FILE: 'marketing-coupon/mgmt/coupon/template/downloadTemplate'
};

// ===== upload =====

function getUploadPath(hostType, uploadType) {
  const baseUrl = host.getBaseUrl(hostType, process.env.ENV_CONFIG);
  return baseUrl + UPLOAD_URL[uploadType];
}

export function getCommonUploadPath(hostType) {
  // return getUploadPath(hostType, 'COMMON');
  return getUploadPath(hostType, 'MEMBER');
}

export function getBillFlowUploadPath(hostType) {
  return getUploadPath(hostType, 'BILL_FLOW');
}

export function getReconBankUploadPath(hostType) {
  return getUploadPath(hostType, 'RECON_BANK');
}

export function getPayRequestUploadPath(hostType) {
  return getUploadPath(hostType, 'PAY_REQUEST');
}

export function getContractUploadPath(hostType) {
  return getUploadPath(hostType, 'CONTRACT');
}

export function getAccountReceiptUploadPath(hostType) {
  return getUploadPath(hostType, 'ACCOUNT_RECEIPT');
}

// ===== download =====

export function getDownloadPath(hostType, downloadType) {
  const baseUrl = host.getBaseUrl(hostType, process.env.ENV_CONFIG);
  return baseUrl + DOWNLOAD_URL[downloadType];
}

export function getPayApproveListDownloadPath(hostType, approvalId, timeZone, token) {
  return getDownloadPath(hostType, 'PAY_APPROVE_LIST') + `?approvalId=${approvalId}&timeZone=${timeZone}&X-Token=${token}`;
}
