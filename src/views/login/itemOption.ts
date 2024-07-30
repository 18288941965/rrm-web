// 退出系统
import {ItemBean} from './itemModel'
import axios from 'axios'
import {AxiosResult} from '@utils/interface'

const createItem = (bean: ItemBean) => {
    console.log(bean)
    return axios.post('/item', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateItem = (bean: ItemBean) => {
    return axios.put('/item', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

export {
    createItem,
    updateItem,
}