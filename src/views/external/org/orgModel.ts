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
    isDeleted?: number
    deletedAt?: Date
    extendedField?: string
    extendedField2?: string
}

interface OrgBeanQuery extends OrgBeanBase, PaginationQr{
}

interface OrgBeanVO extends OrgBean{
    typeName: string | null
    children: Array<OrgBeanVO>
    disabled?: boolean
}

interface OrgBeanActive extends OrgBeanBase{
    id: string
    childrenCount: number
}

export {
    type OrgBeanBase,
    type OrgBean,
    type OrgBeanQuery,
    type OrgBeanVO,
    type OrgBeanActive,
}