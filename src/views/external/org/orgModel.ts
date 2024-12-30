import {PaginationQr} from '@utils/interface'

interface OrgBeanBase{
    code: string
    name: string
}

interface OrgBean extends OrgBeanBase{
    id: string
    parentCode: string | null
    abbrName: string | null
    type: string | null
    status: number
    extendedField?: string
    extendedField2?: string
}

interface OrgBeanQuery extends OrgBeanBase, PaginationQr{
}

interface OrgBeanVO extends OrgBean{
    typeName: string | null
    statusName: string
    updatedAt: Date | null
    children: Array<OrgBeanVO>
    childrenCount: number
    disabled?: boolean
}

interface OrgBeanActive extends OrgBeanBase{
    id: string
    abbrName: string
    typeName: string
    updatedAt: Date | null
    statusName: string
    childrenCount: number
}

export {
    type OrgBeanBase,
    type OrgBean,
    type OrgBeanQuery,
    type OrgBeanVO,
    type OrgBeanActive,
}