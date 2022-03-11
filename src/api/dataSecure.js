import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize
    };
    return post('query-order-config/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveQueryOrderConfig(queryOrderConfig) {
    return post('query-order-config/save', queryOrderConfig, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function queryQueryOrderConfig(id) {
    return get('query-order-config/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updQueryOrderConfig(queryOrderConfig) {
    return post('query-order-config/update', queryOrderConfig, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delQueryOrderConfig(id) {
    return get('query-order-config/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function queryOrderTypeMap() {
    return get('query-order-config/queryOrderTypeMap', null, {
        hostType: 'LOCAL_SEVICE',
    });
};