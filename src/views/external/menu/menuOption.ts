import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {MenuBean, MenuElementBean, MenuSortBean} from './menuModel'

const getMenuById = (id: string) => {
    return axios.get(`/menu/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const createMenu = (menu: MenuBean) => {
    return axios.post('/menu', menu).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateMenu = (menu: MenuBean) => {
    return axios.put('/menu', menu).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const deleteMenuById = (id: string) => {
    return axios.delete(`/menu/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getMenuByItemCode = () => {
    return axios.get('/menu/tree').then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const moveMenuTo = (moveIds: Array<string>, parentId: string) => {
    return axios.put('/menu/move', { moveIds, parentId }).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getMenuByParentId = (parentId: string) => {
    return axios.get(`/menu/children/${parentId}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateMenuSort = (menuList: Array<MenuSortBean>) => {
    return axios.put('/menu/sort', menuList).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getMenuElementByMenuId = (menuId: string) => {
    return axios.get(`/menu-element/${menuId}/children`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getMenuElementById = (id: string) => {
    return axios.get(`/menu-element/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const createMenuElement = (menuElement: MenuElementBean) => {
    return axios.post('/menu-element', menuElement).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateMenuElement = (menuElement: MenuElementBean) => {
    return axios.put('/menu-element', menuElement).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const deleteMenuElementById = (id: string) => {
    return axios.delete(`/menu-element/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}


export {
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenuById,
    getMenuByItemCode,
    moveMenuTo,
    getMenuByParentId,
    updateMenuSort,

    getMenuElementByMenuId,
    getMenuElementById,
    createMenuElement,
    updateMenuElement,
    deleteMenuElementById,
}