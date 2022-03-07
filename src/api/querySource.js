import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize
    };
    return post('query-source/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function querySourceIdMap(pageRequestDTO) {
    return get('query-source/query/sourceIdMap', null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveQuerySource(querySource) {
    return post('query-source/save', querySource, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function queryQuerySource(id) {
    return get('query-source/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updQuerySource(querySource) {
    return post('query-source/update', querySource, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delQuerySource(id) {
    return get('query-source/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};