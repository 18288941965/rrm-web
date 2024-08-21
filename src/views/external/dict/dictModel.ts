import {PaginationQr} from '@utils/interface'

interface DictTypeBeanBase{
    typeCode: string
    typeName: string
}

interface DictTypeBean extends DictTypeBeanBase{
    id: number
    description: string
}

interface DictTypeBeanVO extends DictTypeBean{
    entryCount: number
}

interface DictTypeBeanQuery extends DictTypeBeanBase, PaginationQr{}

interface DictEntryBeanBase{
    entryCode: string
    entryName: string
}

interface DictEntrySortBean{
    id: number
    sortOrder: number
}

interface DictEntryBean extends DictEntryBeanBase, DictEntrySortBean{
    typeId: number
    parentId: number
    status: number
    description: string
}

interface DictEntryBeanQuery extends DictEntryBeanBase, PaginationQr{
    typeId: number
}


export {
    type DictTypeBean,
    type DictTypeBeanVO,
    type DictTypeBeanQuery,
    type DictEntryBeanBase,
    type DictEntryBean,
    type DictEntryBeanQuery,
    type DictEntrySortBean,
}