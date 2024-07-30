/**
 * 项目
 */
interface ItemBean{
    id: number
    itemName: string
    itemCode: string
    itemUser?: string
    itemTime?: string
}

export {
    type ItemBean,
}