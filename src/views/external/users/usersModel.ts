import {PaginationQr} from '@utils/interface'

interface UsersBeanBase{
    name: string
}
interface UsersBeanChoosable{
    registrationDate?: Date
    lastLoginTime?: Date
    failedLoginAttempts?: number
    loginCount?: number
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
    description: string | null
    accountStatus: string
}

interface UsersOrg{
    orgCode: string
    orgName: string
}

interface UsersBeanVO extends UsersBean{
    genderName: string | null
    nationName: string | null
    typeName: string | null
    orgList: Array<UsersOrg>
}

interface UsersBeanQuery extends UsersBeanBase, PaginationQr{
    username: string
    accountStatus: string
}


interface UsersRoleBean{
    usersId: string
    roleId: string
    orgCode: string
}

export {
    type UsersBeanBase,
    type UsersBean,
    type UsersBeanQuery,
    type UsersBeanVO,
    type UsersRoleBean,
}