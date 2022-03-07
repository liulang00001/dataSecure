import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize
    };
    return post('query-order-relevance/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveQueryOrderRelevance(queryOrderRelevance) {
    return post('query-order-relevance/save', queryOrderRelevance, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function queryQueryOrderRelevance(id) {
    return get('query-order-relevance/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updQueryOrderRelevance(queryOrderRelevance) {
    return post('query-order-relevance/update', queryOrderRelevance, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delQueryOrderRelevance(id) {
    return get('query-order-relevance/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function queryHierarchy(curOrderType) {
    return get('query-order-relevance/queryHierarchy/' + curOrderType, null, {
        hostType: 'LOCAL_SEVICE',
    });
};