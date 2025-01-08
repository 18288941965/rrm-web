import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {OrgBean} from './orgModel'

const createOrg = (bean: OrgBean) => {
    return axios.post('/org', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getOrgByItemCode = () => {
    return axios.get('/org/tree').then((res: { data: AxiosResult }) => {
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
    getOrgByItemCode,
    getOrgById,
    deleteOrg,
    updateOrg,
}