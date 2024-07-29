import {reactive, ref} from 'vue'
import {DialogBase, DialogEmpty, DialogParam} from './interface'

// 无参对话框.
export function dialogEmptyContent () {
  const dialogEmpty = reactive<DialogEmpty>({
    show: false,
  })
  const dialogEmptyOpen = () => {
    dialogEmpty.show = true
  }
  const dialogEmptyClose = () => {
    dialogEmpty.show = false
  }
  return {
    dialogEmpty,
    dialogEmptyOpen,
    dialogEmptyClose,
  }
}

// 一个参数对话框
export function dialogBaseContent () {
  const dialogBase = reactive<DialogBase>({
    show: false,
    dataId: undefined,
  })
  const dialogBaseOpen = (id? : string | undefined) => {
    dialogBase.dataId = id
    dialogBase.show = true
  }
  const dialogBaseClose = () => {
    dialogBase.dataId = undefined
    dialogBase.show = false
  }
  return {
    dialogBase,
    dialogBaseOpen,
    dialogBaseClose,
  }
}

// 多参对话框.
export function dialogParamsContent () {
  const dialogParam = reactive<DialogParam>({
    show: false,
    params: {},
  })
  const dialogParamsOpen = (params: any) => {
    dialogParam.params = params
    dialogParam.show = true
  }
  const dialogParamsClose = () => {
    dialogParam.params = {}
    dialogParam.show = false
  }
  return {
    dialogParam,
    dialogParamsOpen,
    dialogParamsClose,
  }
}

// 对话框基本内容
export function dialogOptions (loadingShow?: boolean) {
  const visible = ref(false)
  const fullscreen = ref(false)
  const loading = ref(true)
  if (!loadingShow) {
    loading.value = false
  }
  const isRefresh = ref(false)
  return {
    visible,
    fullscreen,
    loading,
    isRefresh,
  }
}