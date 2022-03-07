import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize
    };
    return post('secure-level/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveSecureLevel(secureLevel) {
    return post('secure-level/save', secureLevel, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function querySecureLevel(id) {
    return get('secure-level/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updSecureLevel(secureLevel) {
    return post('secure-level/update', secureLevel, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delSecureLevel(id) {
    return get('secure-level/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};