import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize
    };
    return post('secure-category/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveSecureCategory(secureCategory) {
    return post('secure-category/save', secureCategory, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function querySecureCategory(id) {
    return get('secure-category/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updSecureCategory(secureCategory) {
    return post('secure-category/update', secureCategory, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delSecureCategory(id) {
    return get('secure-category/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};