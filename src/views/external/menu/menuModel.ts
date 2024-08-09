
interface MenuBean{
    id: string
    parentId: string
    name: string
    icon: string
    sort: number
    visibility: string
    url: string
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