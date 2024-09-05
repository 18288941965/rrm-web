import {PaginationQr} from '@utils/interface'

interface UsersBeanBase{
    name: string
    orgCode: string
    orgName: string
}

interface UsersBean extends UsersBeanBase{
    id: string
    username: string
    password: string
    gender: string
    nation: string
    idNumber: string
    dateOfBirth: Date
    phoneNumber: string
    avatar: string
    type: string
    description: string
    accountStatus: number
    registrationDate: Date
    lastLoginTime: Date
    failedLoginAttempts: number
    loginCount: number
    approvalStatus: number
    approvalAt: Date
    isDeleted: number
    deletedAt: Date
    extendedField?: string
    extendedField2?: string
}

interface UsersBeanQuery extends UsersBeanBase, PaginationQr{
}

export {
    type UsersBeanBase,
    type UsersBean,
    type UsersBeanQuery,
}