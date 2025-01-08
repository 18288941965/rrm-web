import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {RoleBean, RoleMenuBean} from './roleModel'

const createRole = (bean: RoleBean) => {
    return axios.post('/role', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const searchRoleTree = () => {
    return axios.get('/role/tree').then((res: { data: AxiosResult }) => {
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

const bindRoleMenu = (bean: RoleMenuBean) => {
    return axios.post('/role-menu', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getRoleBindMenuByRoleId = (roleId: string) => {
    return axios.get(`/role-menu/${roleId}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const unbindRoleMenu = (roleId: string, menuId: string, type: string) => {
    return axios.delete(`/role-menu/${roleId}/${menuId}/${type}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

export {
    createRole,
    searchRoleTree,
    getRoleById,
    deleteRole,
    updateRoleStatus,
    updateRole,
    bindRoleMenu,
    getRoleBindMenuByRoleId,
    unbindRoleMenu,
}