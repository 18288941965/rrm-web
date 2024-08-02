import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {UserBean} from './userModel'

const createUser = (bean: UserBean) => {
    return axios.post('/user', bean).then((res: { data: AxiosResult }) => {
        return res.data
    })
}

const updateUser = (bean: UserBean) => {
    return axios.put('/user', bean).then((res: { data: AxiosResult }) => {
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

export {
    createUser,
    updateUser,
    getAllUser,
    deleteUser,
}