import {PaginationQr} from '@utils/interface'

interface RoleBeanBase{
    name: string
    level: number | undefined
}

interface RoleBean extends RoleBeanBase{
    id: string
    status: number
    sortOrder: number
    description: string
}

interface RoleBeanQuery extends RoleBeanBase, PaginationQr{
}

export {
    type RoleBeanBase,
    type RoleBean,
    type RoleBeanQuery,
}