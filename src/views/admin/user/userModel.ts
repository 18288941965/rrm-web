
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

export {
    type UserBeanBase,
    type UserBean,
    type UserPassBean,
}