import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {DictTypeBean, DictTypeBeanQuery} from './dictModel'

// 分页查询
const searchWithPagination = (params: DictTypeBeanQuery) => {
    return axios.post('/dict/type/pagination', params).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 根据ID查询字典类型
const getDictTypeById = (id: number) => {
    return axios.get(`/dict/type/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 创建新的字典类型
const createDictType = (bean: DictTypeBean) => {
    return axios.post('/dict/type', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 更新字典类型
const updateDictType = (bean: DictTypeBean) => {
    return axios.put('/dict/type', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 删除字典类型
const deleteDictType = (id: number) => {
    return axios.delete(`/dict/type/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}


export {
    searchWithPagination,
    getDictTypeById,
    createDictType,
    updateDictType,
    deleteDictType,
}