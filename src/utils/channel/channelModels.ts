/**
 * 广播消息接口.
 * @param code 代码
 * @param message 提示消息
 */
interface ChannelData {
    code: number
    message: string
}

/**
 * BroadcastChannel code 定义
 * 1 ： 广播消息到同域名窗口，① 如果是登录窗口则跳转到首页；② 如果是其他窗口则重新加载页面；[如果channel消息窗口打开则关闭]
 * 99 : 广播消息到同域名窗口，关闭窗口不做任何操作
 * 100 ： 【弹窗提示】 关闭窗口跳转到登录页面
 */
export enum BCEnum {
    LOGIN = 1,
    OTHER = 99,
    LOGOUT = 100
}

export type {
    ChannelData,
}