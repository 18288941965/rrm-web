import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {UserBean, UserBeanBase, UserPassBean} from './userModel'

const createUser = (bean: UserBean) => {
    return axios.post('/user', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateUserDescription = (id: number, description: string | null) => {
    return axios.put('/user/description', {id, description}).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const getAllUser = () => {
    return axios.get('/user').then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const deleteUser = (id: number) => {
    return axios.delete(`/user/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 根据id获取账号信息
const getUserById = (id: number) => {
    return axios.get(`/user/${id}`).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 验证密码是否正确
const validatePass = (userBeanBase: UserBeanBase) => {
    return axios.post('/user/validatePass', userBeanBase).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 修改密码
const updatePass = (userPassBean: UserPassBean) => {
    return axios.put('/user/password', userPassBean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

// 获取所有账号的基本信息
const getAllUserBase = () => {
    return axios.get('/user/allUserBase').then((res: { data: AxiosResult }) => {
        return res.data
    })
}

export {
    createUser,
    updateUserDescription,
    getAllUser,
    getUserById,
    deleteUser,
    validatePass,
    updatePass,
    getAllUserBase,
}