
interface UserBeanBase{
    username: string
    password: string
}

interface UserBean extends UserBeanBase{
    id: number
    comment: string
}

export {
    type UserBeanBase,
    type UserBean,
}