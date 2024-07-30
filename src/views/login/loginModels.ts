/**
 * 登录状态.
 * LS(loginStatus).
 */
enum LSEnum{
    LOG_OUT = '',
    LOG_IN = '1',
    LOG_ITEM = '2'
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

export {
    LSEnum,
    type LoginBean,
}