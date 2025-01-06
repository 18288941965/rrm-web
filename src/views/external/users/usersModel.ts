import {PaginationQr} from '@utils/interface'
import {OrgCheck} from '../org/orgModel'

interface UsersBeanBase{
    name: string
    username: string
    status: string
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
    password: string
    gender: string | null
    nation: string | null
    idNumber: string
    dateOfBirth: Date | null
    phoneNumber: string
    avatar: string | null
    type: string | null
    description: string | null
    orgList: Array<OrgCheck>
}

interface UsersBeanVO extends UsersBean{
    genderName: string | null
    nationName: string | null
    typeName: string | null
}

interface UsersBeanQuery extends UsersBeanBase, PaginationQr{
}

interface UsersRoleBean{
    usersId: string
    roleIdList: Array<string>
    orgId: string
}

export {
    type UsersBeanBase,
    type UsersBean,
    type UsersBeanQuery,
    type UsersBeanVO,
    type UsersRoleBean,
}