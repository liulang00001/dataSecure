import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize
    };
    return post('secure-scan-source/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveSecureScanSource(secureScanSource) {
    return post('secure-scan-source/save', secureScanSource, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function querySecureScanSource(id) {
    return get('secure-scan-source/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updSecureScanSource(secureScanSource) {
    return post('secure-scan-source/update', secureScanSource, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delSecureScanSource(id) {
    return get('secure-scan-source/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};