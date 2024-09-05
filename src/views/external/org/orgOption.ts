import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {OrgBean, OrgBeanBase} from './orgModel'

const createOrg = (bean: OrgBean) => {
    return axios.post('/org', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const searchOrgPage = (params: OrgBeanBase) => {
    return axios.post('/org/page', params).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getOrgById = (id: string) => {
    return axios.get(`/org/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const deleteOrg = (id: string) => {
    return axios.delete(`/org/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateOrg = (bean: OrgBean) => {
    return axios.put('/org', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

export {
    createOrg,
    searchOrgPage,
    getOrgById,
    deleteOrg,
    updateOrg,
}