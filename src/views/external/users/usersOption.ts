import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {UsersBean, UsersBeanBase} from './usersModel'

const createUsers = (bean: UsersBean) => {
    return axios.post('/users', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const searchUsersPage = (params: UsersBeanBase) => {
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

export {
    createUsers,
    searchUsersPage,
    getUsersById,
    deleteUsers,
    updateUsers,
}