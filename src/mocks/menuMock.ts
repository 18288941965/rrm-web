import * as Mock from 'mockjs'
import {RrmMenuBean} from '../views/theme/menu/menuModels'
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
            { label: '组件', icon: 'Plugins', url: undefined, id: '04', pid: '01', sxh: 3, cache: false, name: undefined, children: children },
            { label: '项目管理', icon: 'System', url: '/app/home/item/index', id: '05', pid: '01', sxh: 4, cache: true, name: 'ItemIndex' },
            { label: '平台账号', icon: 'Account', url: '/app/home/user/index', id: '06', pid: '01', sxh: 5, cache: true, name: 'UserIndex' },
            { label: '菜单管理', icon: 'Apps', url: '/app/home/menu/index', id: '07', pid: '01', sxh: 6, cache: true, name: 'MenuIndex' },
            { label: '角色管理', icon: 'Role', url: '/app/home/role/index', id: '08', pid: '01', sxh: 7, cache: true, name: 'RoleIndex' },
            { label: '资源管理', icon: 'Resource', url: '/app/home/resource/index', id: '09', pid: '01', sxh: 8, cache: true, name: 'ResourceIndex' },
            { label: '字典管理', icon: 'Dict', url: '/app/home/dict/index', id: '10', pid: '01', sxh: 9, cache: true, name: 'DictIndex' },
            { label: '机构管理', icon: 'Organization', url: '/app/home/org/index', id: '11', pid: '01', sxh: 10, cache: true, name: 'OrgIndex' },
            { label: '用户管理', icon: 'User', url: '/app/home/users/index', id: '12', pid: '01', sxh: 11, cache: true, name: 'UsersIndex' },
        ],
    })

    obj.data = menus

    return obj
})