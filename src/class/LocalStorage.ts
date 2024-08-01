import {LocalUserInfoBean} from '@utils/interface'
import {UserFieldEnum} from '@utils/enum'
import {LSEnum} from '../views/login/loginModels'

export default class LocalStorage {
    readonly USER_INFO_KEY: string = 'v-local-user-info'

    getUserInfoObj () {
        const userInfo: LocalUserInfoBean = {
            fontType: '',
            loginStatus: '',
            themeModel: '',
            userName: '',
            token: '',
            itemCode: '',
            itemName: '',
        }
        const item = localStorage.getItem(this.USER_INFO_KEY)
        if (item) {
            const parse = JSON.parse(item)
            Object.assign(userInfo, parse)
        }
        return userInfo
    }


    getUserInfoField (field: UserFieldEnum) {
       const userInfo = this.getUserInfoObj()
        return userInfo[field]
    }

    // 更新用户相关信息
    setUserInfo(userInfo: LocalUserInfoBean) {
        localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo))
    }

    // 清空所有配置信息
    cleanUserInfoObj () {
        const userInfoObj = this.getUserInfoObj()
        const userInfo: LocalUserInfoBean = {
            fontType: userInfoObj.fontType,
            loginStatus: '',
            themeModel: userInfoObj.themeModel,
            userName: '',
            token: '',
            itemCode: '',
            itemName: '',
        }
        this.setUserInfo(userInfo)
    }

    // Set the status and username
    setLoginStatus (loginStatus: LSEnum) {
        const userInfoObj = this.getUserInfoObj()
        userInfoObj.loginStatus = loginStatus
        this.setUserInfo(userInfoObj)
    }


    setLoginUsername(username: string) {
        const userInfoObj = this.getUserInfoObj()
        userInfoObj.userName = username
        this.setUserInfo(userInfoObj)
    }

    setFontType (type: string) {
        const userInfoObj = this.getUserInfoObj()
        userInfoObj.fontType = type
        this.setUserInfo(userInfoObj)
    }

    setThemeModel (model: string | null) {
        const userInfoObj = this.getUserInfoObj()
        if (model === null) {
            userInfoObj.themeModel = ''
        } else {
            userInfoObj.themeModel = model
        }
        this.setUserInfo(userInfoObj)
    }

    // Get the status
    getLoginStatus () {
        return this.getUserInfoField(UserFieldEnum.LOGIN_STATUS)
    }

    getFontType () : string | undefined {
        const item: string = this.getUserInfoField(UserFieldEnum.FONT_TYPE)
        return item ? item : undefined
    }

    getThemeModel() {
        return this.getUserInfoField(UserFieldEnum.THEME_MODEL)
    }

    setToken (token : string | null) {
        const userInfoObj = this.getUserInfoObj()
        if (token == null) {
            userInfoObj.token = ''
        } else {
            userInfoObj.token = token
        }
        this.setUserInfo(userInfoObj)
    }

    getToken () {
        return this.getUserInfoField(UserFieldEnum.TOKEN)
    }

    setItem (itemCode: string, itemName: string) {
        const userInfoObj = this.getUserInfoObj()
        if (itemCode == null) {
            userInfoObj.itemCode = ''
            userInfoObj.itemName = ''
        } else {
            userInfoObj.itemCode = itemCode
            userInfoObj.itemName = itemName
        }
        this.setUserInfo(userInfoObj)
    }
}