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

}

interface MenuBeanVO extends MenuBeanBase {
    typeName: string | null
    children: Array<MenuBeanVO>
}

interface MenuBeanActive extends MenuBeanDefault{
    id: string
    name: string
    childrenCount: number
}

export {
    type MenuBean,
    type MenuBeanVO,
    type MenuBeanActive,
}