import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {DictItemBean, DictItemBeanQuery, DictTypeBean, DictTypeBeanQuery} from './dictModel'

// 分页查询
const searchDictTypePage = (params: DictTypeBeanQuery) => {
    return axios.post('/dict-type/page', params).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 根据ID查询字典类型
const getDictTypeById = (id: number) => {
    return axios.get(`/dict-type/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 创建新的字典类型
const createDictType = (bean: DictTypeBean) => {
    return axios.post('/dict-type', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 更新字典类型
const updateDictType = (bean: DictTypeBean) => {
    return axios.put('/dict-type', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 删除字典类型
const deleteDictType = (id: number) => {
    return axios.delete(`/dict-type/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}


// 分页查询
const searchDictItemPage = (params: DictItemBeanQuery) => {
    return axios.post('/dict-item/page', params).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 根据ID查询字典
const getDictItemById = (id: number) => {
    return axios.get(`/dict-item/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 创建新的字典类型
const createDictItem = (bean: DictItemBean) => {
    return axios.post('/dict-item', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 更新字典类型
const updateDictItem = (bean: DictItemBean) => {
    return axios.put('/dict-item', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 删除字典类型
const deleteDictItem = (id: number) => {
    return axios.delete(`/dict-item/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}


export {
    searchDictTypePage,
    getDictTypeById,
    createDictType,
    updateDictType,
    deleteDictType,

    searchDictItemPage,
    getDictItemById,
    createDictItem,
    updateDictItem,
    deleteDictItem,
}