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
    itemCount: number
}

interface DictTypeBeanQuery extends DictTypeBeanBase, PaginationQr{}

interface DictItemBeanBase{
    itemCode: string
    itemName: string
}

interface DictItemBean extends DictItemBeanBase{
    id: number
    typeCode: string
    parentId: number
    sortOrder: number
    status: number
    description: string
}

interface DictItemBeanQuery extends DictItemBeanBase, PaginationQr{}


export {
    type DictTypeBean,
    type DictTypeBeanVO,
    type DictTypeBeanQuery,
    type DictItemBeanBase,
    type DictItemBean,
    type DictItemBeanQuery,
}