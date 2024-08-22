import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {MenuBean} from './menuModel'

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

export {
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenuById,
}