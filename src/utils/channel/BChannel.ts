import {reactive, ref, inject} from 'vue'
import {ReloadApp} from '../types'
import {RUEnum} from '../../router/routerModels'
import {useRouter} from 'vue-router'
import {ChannelData, BCEnum} from './channelModels'

export default function (BChannel?: BroadcastChannel) {
    const channel = BChannel ? BChannel : inject('channel') as BroadcastChannel

    const router = useRouter()
    const systemMessageList = ref<ChannelData[]>([])

    const activeChannel = reactive<ChannelData>({
        code: -1,
        message: '',
    })

    const resetChannel = () => {
        systemMessageList.value = []
        Object.assign(activeChannel, {
            code: -1,
            message: '',
        })
    }

    const addMessage = (data: ChannelData) => {
        const codes = systemMessageList.value.map(item => item.code)
        if (codes.includes(data.code)) {
            return
        }

        for (let i = 0; i < codes.length; i++) {
            if ( codes[i] > data.code) {
                systemMessageList.value.splice(i, 0, data)
                return
            }
        }

        systemMessageList.value.push(data)
    }

    const postMessage = (data: ChannelData) => {
        channel.postMessage(data)
    }

    // 接受到广播消息处理方法
    const channelOnMessage = (ev: MessageEvent, reloadApp: ReloadApp) => {
        const data = ev.data as ChannelData
        if (data && data.code >= 0 && data.message) {

            // 登录成功
            if (data.code === BCEnum.LOGIN) {
                resetChannel()
                if (router.currentRoute.value.path === RUEnum.LOGIN) {
                    router.replace(RUEnum.HOME)
                } else {
                    reloadApp()
                }
                return
            }

            // 选择项目成功
            if (data.code === BCEnum.ITEM) {
                router.replace(RUEnum.HOME)
                return
            }

            // 退出登录
            if (data.code === BCEnum.LOGOUT) {
                return addMessage(data)
            }

            // TEST
            addMessage(data)
        }
    }

    return {
        channel,
        systemMessageList,
        postMessage,
        activeChannel,
        resetChannel,
        channelOnMessage,
    }
}