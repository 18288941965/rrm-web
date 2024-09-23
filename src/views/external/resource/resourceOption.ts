import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {ResourceQuery} from './resourceModel'

const searchResourcePage = (params: ResourceQuery) => {
    return axios.post('/resource/page', params).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateResourceStatus = (id: string, status: number) => {
    return axios.put('/resource/status', { id, status }).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const scannerRrmResource = () => {
    return axios.get('/scanner').then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const countResourceByItemCode = () => {
    return axios.get('/resource/count').then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getServiceNameList = () => {
    return axios.get('/resource/serviceNameList').then((res: { data: AxiosResult }) => {
        return res.data
    })
}


export {
    searchResourcePage,
    updateResourceStatus,
    scannerRrmResource,
    countResourceByItemCode,
    getServiceNameList,
}