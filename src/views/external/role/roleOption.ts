import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {RoleBean, RoleBeanBase} from './roleModel'

const createRole = (bean: RoleBean) => {
    return axios.post('/role', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const searchRolePage = (params: RoleBeanBase) => {
    return axios.post('/role/page', params).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getRoleById = (id: string) => {
    return axios.get(`/role/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const deleteRole = (id: string) => {
    return axios.delete(`/role/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateRoleStatus = (id: string, status: number) => {
    return axios.put('/role/status', { id, status }).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateRole = (bean: RoleBean) => {
    return axios.put('/role', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

export {
    createRole,
    searchRolePage,
    getRoleById,
    deleteRole,
    updateRoleStatus,
    updateRole,
}