/**
 * 项目
 */
interface ItemBean{
    id: number
    itemName: string
    itemCode: string
}

interface ItemBeanVO{
    userId: number
    itemId: number
    itemName: string
    itemCode: string
    createTime: Date
    username: string
}

export {
    type ItemBean,
    type ItemBeanVO,
}