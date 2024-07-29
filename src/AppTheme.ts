import LocalStorage from './class/LocalStorage'

function themeContext() {
    const local = new LocalStorage()

    // 获取主题
    const getThemeModel = () => {
        let themeModel = local.getThemeModel()
        return themeModel ? themeModel : 'light'
    }

    const setThemeModel = (model: string | null) => {
        local.setThemeModel(model)
        const htmlElement = document.documentElement
        if (htmlElement) {
            htmlElement.setAttribute('class', model ? `${model} app-${model}` : '')
        }
    }

    const initThemeModel = () => {
       const themeModel = getThemeModel()
        setThemeModel(themeModel)
    }

    return {
        initThemeModel,
        getThemeModel,
        setThemeModel,
    }
}

export {
    themeContext,
}