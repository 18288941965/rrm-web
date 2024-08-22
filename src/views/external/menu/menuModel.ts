
interface MenuBean{
    id: string
    parentId: string
    name: string
    icon: string
    sortOrder: number
    visibility: string
    path: string
    type: string
    target: string
    pageName: string
    pageCache: string
    version: string
    itemCode: string
}

export {
    type MenuBean,
}