import {ref} from 'vue'
import LocalStorage from '../../class/LocalStorage'

function appSettingsContext() {
    const local = new LocalStorage()
    const fontSize = ref('')
    const fontType = ['small', 'medium', 'large']

    const setHtmlFont = (size = 'medium') => {
        const temp = fontType.includes(size) ? size : 'medium'
        const htmlElement = document.documentElement
        if (htmlElement) {
            htmlElement.style.fontSize = `var(--font-size-${temp})`
            local.setFontType(temp)
            fontSize.value = temp
        }
    }

    const initFontSize = () => {
        const item = local.getFontType()
        setHtmlFont(item)
    }

    return {
        fontSize,
        initFontSize,
        setHtmlFont,
    }
}

export {
    appSettingsContext,
}