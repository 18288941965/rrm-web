interface OrgBeanBase{
    code: string
    name: string
}

interface OrgCheck extends OrgBeanBase{
    id: string
    defaultLogin?: number
    roleCount?: number
}

interface OrgBean extends OrgBeanBase{
    id: string
    parentId: string | null
    abbrName: string | null
    type: string | null
    status: string
    extendedField?: string
    extendedField2?: string
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
    type OrgBeanVO,
    type OrgBeanActive,
    type OrgCheck,
}