import * as Mock from 'mockjs'
import {MenuBean} from '../views/theme/menu/menuModels'
import {AxiosResult} from '@utils/interface'

// 获取菜单列表：返回tree结构
Mock.mock('/api/admin/getMenus', 'post',() => {
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

    const menus: Array<MenuBean> = []
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
            { label: '图标', icon: 'Flag', url: '/app/home/icon/demo', id: '04', pid: '01', sxh: 2, cache: true, name: 'IconDemo' },
            { label: '组件', icon: 'Plugins', url: undefined, id: '03', pid: '01', sxh: 3, cache: false, name: undefined, children: children },
            { label: '项目管理', icon: 'Plugins', url: '/app/home/item/index', id: '04', pid: '01', sxh: 4, cache: true, name: 'ItemIndex' },
            { label: '用户管理', icon: 'Plugins', url: '/app/home/user/index', id: '05', pid: '01', sxh: 5, cache: true, name: 'UserIndex' },
        ],
    })

    obj.data = menus

    return obj
})