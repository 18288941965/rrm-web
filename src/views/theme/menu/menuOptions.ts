import {reactive, ref} from 'vue'
import {ActiveMenus, MenuBean} from './menuModels'
import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {PushRouter} from '@utils/types'
import menuDfs from '../../../algo/menuDfs'
import {useRouter} from 'vue-router'

export function MenuStatusContent() {
    const keepAliveInclude = ref<string[]>([])
    const activeMenuPath = ref<MenuBean[]>([])
    const activeMenus = reactive<ActiveMenus>({
        menuId: '',
        menus: [],
    })
    const menuCollapse = ref(false)
    // 清理历史记录：所有数据
    const cleanActiveMenuPath = () => {
        activeMenuPath.value = []
    }
    // 把路由加入缓存中
    const updateKeepAliveInclude = (name: string) => {
        if (!keepAliveInclude.value.includes(name)) {
            keepAliveInclude.value.push(name)
        }
    }
    // 更新激活的菜单
    const updateActiveMenus = (menu: MenuBean) => {
        activeMenus.menuId = menu.id
        const menuIds = activeMenus.menus.map(item => item.id)
        if (!menuIds.includes(menu.id)) {
            activeMenus.menus.push(menu)
        }
    }
    // 清理历史记录: 清空缓存
    const cleanKeepAliveInclude = (id: string | undefined) => {
        // 关闭除打开页面外的所有窗口
        if (!id) {
            const openObj = activeMenus.menus.find(item => item.id === activeMenus.menuId)
            keepAliveInclude.value =
                openObj
                && openObj.name
                && keepAliveInclude.value.includes(openObj.name) ? [openObj.name] : []
            return
        }

        // 关闭指定的窗口
        const closeObj = activeMenus.menus.find(item => item.id === id)
        if (closeObj && closeObj.name) {
            const _index = keepAliveInclude.value.indexOf(closeObj.name)
            if (_index != -1) {
                keepAliveInclude.value.splice(_index, 1)
            }
        }
    }
    // 清理历史记录：清空数据
    const cleanActiveMenus = (id: string | undefined, index: number) => {
        // 关闭除打开页面外的所有窗口
        if (!id) {
            const openObj = activeMenus.menus.find(item => item.id === activeMenus.menuId)
            if (openObj) {
                activeMenus.menus = [openObj]
            }
            return
        }

        // 关闭指定的窗口
        const findObj = activeMenus.menus.find(item => item.id === id)
        if (findObj) {
            if (activeMenus.menuId === findObj.id) {
                activeMenus.menuId = ''
            }
            activeMenus.menus.splice(index, 1)
        }
    }
    // 处理左侧菜单的展开和折叠
    const setMenuCollapse = (collapse: boolean) => {
        const documentElement = document.documentElement
        if (documentElement) {
            const styles = getComputedStyle(documentElement)
            let data: string = styles.getPropertyValue('--sidebar-width')
            const width = 260
            if (data) {
                data = data.replace('px', '')
                if (parseInt(data) >= width) {
                    data = '64px'
                } else {
                    data = `${width}px`
                }
                documentElement.style.setProperty('--sidebar-width', data)
            }
        }

        menuCollapse.value = collapse
    }
    return {
        activeMenuPath,
        activeMenus,
        menuCollapse,
        setMenuCollapse,
        updateActiveMenus,
        cleanActiveMenus,
        keepAliveInclude,
        cleanKeepAliveInclude,
        updateKeepAliveInclude,
        cleanActiveMenuPath,
    }
}

/**
 * 加载模块的菜单数据.
 * 这里是框架为了适配多个主题做了区分，实际开发请按需求修改下列查询参数。
 * @constructor
 */
export function MenuOptions() {
    const menus = ref<MenuBean[]>([])
    const menuDefaultOpeneds = ref<String[]>([])
    const router = useRouter()

    // 获取菜单并设置打开菜单样式
    const getMenus = (pushRouter: PushRouter, routerPath: string, loadCallback: Function | undefined ) => {
        menuDefaultOpeneds.value = []
        axios.post('/admin/getMenus', { }).then((res: {data: AxiosResult}) => {
            if (res.data.code === 200) {
                const data = res.data.data

                if (data.length === 0) {
                    menus.value = []
                    return
                }

                if (loadCallback) {
                    loadCallback(data[0].id, data[0].label, data[0].icon)
                }

                // 菜单的深度优先搜索
                const menuNodes = menuDfs(data[0], routerPath)
                if (menuNodes.length === 0) {
                    menus.value = data
                    return
                }

                menuDefaultOpeneds.value = menuNodes.map(menuNodes => menuNodes.id)
                menuDefaultOpeneds.value.splice(menuNodes.length - 1, 1)
                menus.value = data

                const currentRoute = menuNodes[menuNodes.length - 1]
                currentRoute && currentRoute.url ? pushRouter(currentRoute) : null
            }
        })
    }

    return {
        menus,
        menuDefaultOpeneds,
        getMenus,
    }
}