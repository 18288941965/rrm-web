/**
 * 登录状态.
 * LS(loginStatus).
 */
enum LSEnum{
    LOG_OUT = '',
    LOG_IN = '1',
    LOG_INST = '2'
}

/**
 * 登录对象.
 * @param username 用户名
 * @param password 密码
 */
interface LoginBean{
    username: string
    password: string
}

/**
 * 项目
 */
interface ItemBean{
    itemName: string
    itemCode: string
    itemUser: string
    itemTime: string
}

export {
    LSEnum,
    type LoginBean,
    type ItemBean,
}