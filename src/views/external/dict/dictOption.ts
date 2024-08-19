import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {DictEntryBean, DictEntryBeanQuery, DictTypeBean, DictTypeBeanQuery} from './dictModel'

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
const searchDictEntryPage = (params: DictEntryBeanQuery) => {
    return axios.post('/dict-entry/page', params).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 根据ID查询字典
const getDictEntryById = (id: number) => {
    return axios.get(`/dict-entry/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 创建新的字典类型
const createDictEntry = (bean: DictEntryBean) => {
    return axios.post('/dict-entry', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 更新字典类型
const updateDictEntry = (bean: DictEntryBean) => {
    return axios.put('/dict-entry', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 删除字典类型
const deleteDictEntry = (id: number) => {
    return axios.delete(`/dict-entry/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}


export {
    searchDictTypePage,
    getDictTypeById,
    createDictType,
    updateDictType,
    deleteDictType,

    searchDictEntryPage,
    getDictEntryById,
    createDictEntry,
    updateDictEntry,
    deleteDictEntry,
}