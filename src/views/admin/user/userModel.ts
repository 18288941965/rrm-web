import {ItemBeanAll} from '../item/itemModel'

interface UserBeanBase{
    username: string
    password: string
}

interface UserBean extends UserBeanBase{
    id: number
    description: string | null
}

interface UserPassBean{
    password: string
    newPassword: string
}

interface UserItemBean extends UserBean{
    loginId: number
    itemList: Array<ItemBeanAll>
}

export {
    type UserBeanBase,
    type UserBean,
    type UserPassBean,
    type UserItemBean,
}