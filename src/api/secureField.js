import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize
    };
    return post('secure-field/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveSecureField(secureField) {
    return post('secure-field/save', secureField, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function querySecureField(id) {
    return get('secure-field/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updSecureField(secureField) {
    return post('secure-field/update', secureField, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delSecureField(id) {
    return get('secure-field/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};