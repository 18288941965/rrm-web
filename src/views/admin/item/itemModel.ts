import {UserBean} from '../user/userModel'

/**
 * 项目
 */
interface ItemBean{
    id: number
    itemName: string
    itemCode: string
}

interface ItemBeanVO extends ItemBean{
    createTime: Date
    userId: number
    loginId: number
    userList: Array<UserBean>
}

interface ItemBeanAll extends ItemBean{
    createTime: Date
    userId: number
}

export {
    type ItemBean,
    type ItemBeanVO,
    type ItemBeanAll,
}