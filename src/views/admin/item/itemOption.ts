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

const getItemById = (id: number) => {
    return axios.get(`/item/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const deleteItem = (id: number) => {
    return axios.delete(`/item/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getCorrelationUserId = (itemCode: string) => {
    return axios.get(`/item/correlationUserId/${itemCode}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const deleteUserItem = (userId: number, itemCode: string) => {
    return axios.delete(`/user-item/${userId}/${itemCode}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const createUserItem = (userId: number, itemCode: string) => {
    return axios.post('/user-item', { userId, itemCode }).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

export {
    createItem,
    updateItem,
    getAllItem,
    getItemById,
    deleteItem,
    getCorrelationUserId,
    deleteUserItem,
    createUserItem,
}