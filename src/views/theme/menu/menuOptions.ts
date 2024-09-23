import {reactive, ref} from 'vue'
import {ActiveMenus} from './menuModels'
import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {PushRouter} from '@utils/types'
import rrmMenuDfs from '../../../algo/rrmMenuDfs'
import {useRouter} from 'vue-router'
import {RrmMenuBean} from './menuModels'

export function MenuStatusContent() {
    const keepAliveInclude = ref<string[]>([])
    const activeMenuPath = ref<RrmMenuBean[]>([])
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
    const updateActiveMenus = (menu: RrmMenuBean) => {
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
    const menus = ref<RrmMenuBean[]>([])
    const menuDefaultOpeneds = ref<String[]>([])
    const router = useRouter()

    const getDemoData = () => {
        const obj: AxiosResult = {
            code: 200,
            message: '操作成功',
            data: [],
        }

        const children = [
            {
                label: 'dic组件',
                icon: '',
                url: '/app/home/ev/dic',
                id: '03-01',
                pid: '03',
                sxh: 1,
                cache: false,
                name: 'EvDicDemo',
            },
            {
                label: 'pagination组件',
                icon: '',
                url: '/app/home/ev/pagination',
                id: '03-02',
                pid: '03',
                sxh: 2,
                cache: true,
                name: 'EvPaginationDemo',
            },
        ]

        const menus: Array<RrmMenuBean> = []
        menus.push({
            label: 'RRM',
            icon: 'admin-temp.png',
            url: '/app/home',
            id: '01',
            pid: undefined,
            sxh: 1,
            cache: false,
            name: 'AdminTheme',
            children: [
                { label: '首页', icon: 'Dashboard', url: '/app/home/dashboard', id: '02', pid: '01', sxh: 1, cache: true, name: 'AdminDashboard' },
                { label: '图标', icon: 'Flag', url: '/app/home/icon/demo', id: '03', pid: '01', sxh: 2, cache: true, name: 'IconDemo' },
                /*{ label: '组件', icon: 'Plugins', url: undefined, id: '04', pid: '01', sxh: 3, cache: false, name: undefined, children: children },*/
                { label: '字典管理', icon: 'Dict', url: '/app/home/dict/index', id: '10', pid: '01', sxh: 9, cache: true, name: 'DictIndex' },
                { label: '项目管理', icon: 'System', url: '/app/home/item/index', id: '05', pid: '01', sxh: 4, cache: true, name: 'ItemIndex' },
                { label: '平台账号', icon: 'Account', url: '/app/home/user/index', id: '06', pid: '01', sxh: 5, cache: true, name: 'UserIndex' },
                { label: '资源管理', icon: 'Resource', url: '/app/home/resource/index', id: '09', pid: '01', sxh: 8, cache: true, name: 'ResourceIndex' },
                { label: '菜单管理', icon: 'Apps', url: '/app/home/menu/index', id: '07', pid: '01', sxh: 6, cache: true, name: 'MenuIndex' },
                { label: '角色管理', icon: 'Role', url: '/app/home/role/index', id: '08', pid: '01', sxh: 7, cache: true, name: 'RoleIndex' },
                { label: '机构管理', icon: 'Organization', url: '/app/home/org/index', id: '11', pid: '01', sxh: 10, cache: true, name: 'OrgIndex' },
                { label: '用户管理', icon: 'User', url: '/app/home/users/index', id: '12', pid: '01', sxh: 11, cache: true, name: 'UsersIndex' },
            ],
        })

        obj.data = menus

        return obj
    }

    // 获取菜单并设置打开菜单样式
    const getMenus = (pushRouter: PushRouter, routerPath: string, loadCallback: Function | undefined ) => {
        menuDefaultOpeneds.value = []
        const resData = getDemoData()

        if (resData.code === 200) {
            const data = resData.data

            if (data.length === 0) {
                menus.value = []
                return
            }

            if (loadCallback) {
                loadCallback(data[0].id, data[0].label, data[0].icon)
            }

            // 菜单的深度优先搜索
            const menuNodes = rrmMenuDfs(data[0], routerPath)
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
    }

    return {
        menus,
        menuDefaultOpeneds,
        getMenus,
    }
}