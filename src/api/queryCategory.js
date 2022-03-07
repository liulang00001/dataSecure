import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize
    };
    return post('query-category/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveQueryCategory(queryCategory) {
    return post('query-category/save', queryCategory, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function queryQueryCategory(id) {
    return get('query-category/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updQueryCategory(queryCategory) {
    return post('query-category/update', queryCategory, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delQueryCategory(id) {
    return get('query-category/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};