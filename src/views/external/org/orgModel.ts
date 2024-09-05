import {PaginationQr} from '@utils/interface'

interface OrgBeanBase{
    code: string
    name: string
}

interface OrgBean extends OrgBeanBase{
    id: string
    parentCode: string
    abbrName: string
    type: string
    isDeleted: number
    deletedAt: Date
    extendedField?: string
    extendedField2?: string
}

interface OrgBeanQuery extends OrgBeanBase, PaginationQr{
}

export {
    type OrgBeanBase,
    type OrgBean,
    type OrgBeanQuery,
}