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
}

interface MenuBean extends MenuBeanBase{
    createdAt?: Date
    updatedAt?: Date
}

interface MenuBeanVO extends MenuBeanBase {
    typeName: string | null
    children: Array<MenuBeanVO>
    disabled?: boolean
}

interface MenuBeanActive extends MenuBeanDefault{
    id: string
    name: string
    childrenCount: number
}

interface MenuSortBean{
    id: string
    sortOrder: number
}

export {
    type MenuBean,
    type MenuBeanVO,
    type MenuBeanActive,
    type MenuSortBean,
}