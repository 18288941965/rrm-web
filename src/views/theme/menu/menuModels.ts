/**
 * @param id 菜单ID
 * @param label 菜单名称
 * @param icon 菜单图标
 */
interface MenuBeanBase{
    id: string
    label: string
    icon: string | undefined
}

/**
 * @param pid 上级菜单ID
 * @param url 菜单地址
 * @param cache 是否缓存菜单
 * @param name 菜单路由名称
 * @param sxh 菜单排序号
 * @param children 子菜单
 */
interface MenuBean extends MenuBeanBase{
    pid: string | undefined
    url: string | undefined
    cache: boolean
    name: string | undefined
    sxh: number | undefined
    children?: Array<MenuBean>
}

/**
 * @param menuId 当前打开的菜单ID
 * @param menus 历史打开的菜单列表
 */
interface ActiveMenus {
    menuId: string
    menus: Array<MenuBean>
}

export type {
    MenuBeanBase,
    MenuBean,
    ActiveMenus,
}