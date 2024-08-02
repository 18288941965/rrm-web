// 退出系统
import {ItemBean} from './itemModel'
import axios from 'axios'
import {AxiosResult} from '@utils/interface'

const createItem = (bean: ItemBean) => {
    return axios.post('/item', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateItem = (bean: ItemBean) => {
    return axios.put('/item', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getAllItem = () => {
    return axios.get('/item').then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const selectItem = (itemCode: string) => {
    return axios.put('/auth/select', {itemCode}).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

export {
    createItem,
    updateItem,
    getAllItem,
    selectItem,
}