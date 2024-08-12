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

export {
    type DictTypeBean,
    type DictTypeBeanVO,
    type DictTypeBeanQuery,
}