interface RoleBeanBase{
    name: string
    type: string
}

interface RoleBean extends RoleBeanBase{
    id: string
    parentId: string | null
    status: number
    sortOrder: number
    description: string
    terminal: string
    netType: string
}

interface RoleBeanVO extends RoleBean{
    typeName: string
    terminalName: string
    netTypeName: string
    bindMenuCount: number
    bindElementCount: number
    children: Array<RoleBeanVO>
    childrenCount: number
}

interface RoleBeanActive {
    id: string
    name: string
    status: number
    description: string
    typeName: string
    terminalName: string
    netTypeName: string
    bindMenuCount: number
    bindElementCount: number
    children: Array<RoleBeanVO>
    childrenCount: number
}

interface RoleMenuBean{
    roleId: string
    menuId: string
    type: string
}

export {
    type RoleBeanBase,
    type RoleBean,
    type RoleMenuBean,
    type RoleBeanVO,
    type RoleBeanActive,
}