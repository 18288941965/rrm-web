import {ItemBeanAll} from '../item/itemModel'

interface UserBeanBase{
    username: string
    password: string
}

interface UserBean extends UserBeanBase{
    id: number
    comment: string
}

interface UserPassBean{
    password: string
    newPassword: string
}

interface UserItemBean extends UserBean{
    itemList: Array<ItemBeanAll>
}

export {
    type UserBeanBase,
    type UserBean,
    type UserPassBean,
    type UserItemBean,
}