interface MenuBeanDefault{
    id: string
    name: string
}

interface MenuBeanBase extends MenuBeanDefault{
    parentId: string | null
    icon: string | null
    sortOrder: number
    visibility: number
    path: string
    type: string | null
    target: string
    pageName: string | null
    pageCache: number
    version: string
    terminal: string
    netType: string
}

interface MenuBean extends MenuBeanBase{
    createdAt?: Date
    updatedAt?: Date
}

interface MenuDicName {
    typeName: string
    terminalName: string
    netTypeName: string
}

interface MenuBeanVO extends MenuBeanBase, MenuDicName {
    children: Array<MenuBeanVO>
    disabled?: boolean
    status: number
}

interface MenuBeanActive extends MenuBeanDefault, MenuDicName{
    status: number
    visibility: number
    terminal: string
    netType: string
    childrenCount: number
    bindResourceCount?: number
}

interface MenuSortBean{
    id: string
    sortOrder: number
}

interface MenuElementBean extends MenuBeanDefault{
    menuId: string
    type: string
}

interface MenuElementBeanVO extends MenuElementBean{
    status: number
    bindResourceCount?: number
    checked?: boolean
}

interface MenuResourceBean{
    menuId: string
    resourceId: string
    type: string
}

export {
    type MenuBean,
    type MenuBeanVO,
    type MenuBeanActive,
    type MenuSortBean,

    type MenuResourceBean,

    type MenuElementBean,
    type MenuElementBeanVO,
}