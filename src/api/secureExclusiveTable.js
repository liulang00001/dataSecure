import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize,
        params: (pageRequestDTO.params === null ? null : pageRequestDTO.params)
    };
    
    return post('secure-exclusive-table/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveSecureExclusiveTable(secureExclusiveTable) {
    return post('secure-exclusive-table/save', secureExclusiveTable, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function querySecureExclusiveTable(id) {
    return get('secure-exclusive-table/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function queryTableSchema() {
    return get('secure-exclusive-table/query/tableSchema', null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updSecureExclusiveTable(secureExclusiveTable) {
    return post('secure-exclusive-table/update', secureExclusiveTable, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delSecureExclusiveTable(id) {
    return get('secure-exclusive-table/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};