import {PaginationQr} from '@utils/interface'

interface RoleBeanBase{
    name: string
    type: string
}

interface RoleBean extends RoleBeanBase{
    id: string
    status: number
    sortOrder: number
    description: string
}

interface RoleBeanQuery extends RoleBeanBase, PaginationQr{
}

interface RoleBeanVO extends RoleBean{
    bindMenuCount: number
    bindElementCount: number
}

interface RoleMenuBean{
    roleId: string
    menuId: string
    type: string
}

export {
    type RoleBeanBase,
    type RoleBean,
    type RoleBeanQuery,
    type RoleMenuBean,
    type RoleBeanVO,
}