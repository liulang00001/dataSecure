import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize
    };
    return post('query-template/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveQueryTemplate(queryTemplate) {
    return post('query-template/save', queryTemplate, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function queryQueryTemplate(id) {
    return get('query-template/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updQueryTemplate(queryTemplate) {
    return post('query-template/update', queryTemplate, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delQueryTemplate(id) {
    return get('query-template/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};