import { post, get } from '@/utils/simpleRequest';

export function getTableData(pageRequestDTO) {
    const data = {
        pageNum: pageRequestDTO.pageNum,
        pageSize: pageRequestDTO.pageSize
    };
    return post('fintech-domain/page/list', data, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function saveFintechDomain(fintechDomain) {
    return post('fintech-domain/save', fintechDomain, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function queryFintechDomain(id) {
    return get('fintech-domain/query/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function updFintechDomain(fintechDomain) {
    return post('fintech-domain/update', fintechDomain, {
        hostType: 'LOCAL_SEVICE',
    });
};

export function delFintechDomain(id) {
    return get('fintech-domain/delete/' + id, null, {
        hostType: 'LOCAL_SEVICE',
    });
};