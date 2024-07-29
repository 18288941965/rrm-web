import {PropType, ref} from 'vue'
import axios from 'axios'
import {AxiosResult} from '@utils/interface'

export const uniqueKey = () : string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// 字典
export interface LabelValue {
    label: string
    value: string
}

// 默认属性
export const defaultProps = {
    dictType: {
        type: String,
        default: undefined,
        require: true,
    },
    reqUrl: {
        type: String,
        default: undefined,
    },
    dataList: {
        type: Array,
        default: undefined,
    },
    labelUpdate: {
        type: Boolean,
        default: false,
    },
    defaultAttr: {
        type: Object as PropType<LabelValue>,
        default: () => {
            return { label: 'label', value: 'value' }
        },
    },
}

export function getEvElContext () {
    const dictList = ref<LabelValue[]>([])

    /**
     * 根据字典类型获取字典.
     * 这里的url是固定的
     */
    const getDataByDictType = (dictType: string) => {
        axios.post('/admin/getDict', { dictType }).then((res: {data: AxiosResult}) => {
            if (res.data.code === 200) {
                dictList.value = res.data.data
            }
        })
    }

    /**
     * 根据请求地址获取数据。
     * 根据数据读取字段重构对象。
     * 必须是GET请求
     */
    const getDataByReqUrl = (reqUrl: string, defaultAttr: LabelValue) => {
        axios.get(reqUrl).then((res: {data: AxiosResult}) => {
            if (res.data.code === 200) {
                dictList.value = res.data.data.map((row: any) => {
                    return {
                        label: row[defaultAttr.label],
                        value: row[defaultAttr.label],
                    }
                })
            }
        })
    }

    /**
     * 解析已有的数据
     * @param dataList
     * @param defaultAttr
     */
    const getDataByDataList = (dataList: any, defaultAttr: LabelValue) => {
        dictList.value = dataList.map((row: any) => {
            return {
                label: row[defaultAttr.label],
                value: row[defaultAttr.value],
            }
        })
    }

    return {
        dictList,
        getDataByDictType,
        getDataByReqUrl,
        getDataByDataList,
    }
}