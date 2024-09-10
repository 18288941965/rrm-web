import {PaginationQr} from '@utils/interface'

interface UsersBeanBase{
    name: string
    orgCode: string
    orgName: string
}
interface UsersBeanChoosable{
    registrationDate?: Date
    lastLoginTime?: Date
    failedLoginAttempts?: number
    loginCount?: number
    approvalStatus?: number
    approvalAt?: Date
    isDeleted?: number
    deletedAt?: Date
    extendedField?: string
    extendedField2?: string
}
interface UsersBean extends UsersBeanBase, UsersBeanChoosable{
    id: string
    username: string
    password: string
    gender: string | null
    nation: string | null
    idNumber: string
    dateOfBirth: Date | null
    phoneNumber: string
    avatar: string | null
    type: string | null
    description: string
    accountStatus: number
}

interface UsersBeanQuery extends UsersBeanBase, PaginationQr{
}

export {
    type UsersBeanBase,
    type UsersBean,
    type UsersBeanQuery,
}