import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {UsersBean, UsersBeanQuery, UsersRoleBean} from './usersModel'

const createUsers = (bean: UsersBean) => {
    return axios.post('/users', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const searchUsersPage = (params: UsersBeanQuery) => {
    return axios.post('/users/page', params).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getUsersById = (id: string) => {
    return axios.get(`/users/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const deleteUsers = (id: string) => {
    return axios.delete(`/users/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateUsers = (bean: UsersBean) => {
    return axios.put('/users', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const defaultLoginOrg = (usersId: string, orgId: string) => {
    return axios.put('/users/defaultLoginOrg', { usersId, orgId }).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const bindUsersRole = (bean: UsersRoleBean) => {
    return axios.post('/users-role', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getUsersBindRole = (usersId: string, roleId: string) => {
    return axios.get(`/users-role/${usersId}/${roleId}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

export {
    createUsers,
    searchUsersPage,
    getUsersById,
    deleteUsers,
    updateUsers,
    bindUsersRole,
    getUsersBindRole,
    defaultLoginOrg,
}