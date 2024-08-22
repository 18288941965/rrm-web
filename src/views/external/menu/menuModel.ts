
interface MenuBean{
    id: string
    parentId: string | null
    name: string
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

export {
    type MenuBean,
}