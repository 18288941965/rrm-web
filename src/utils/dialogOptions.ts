import {reactive, ref, UnwrapRef} from 'vue'
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
  const dialogEmptyCloseAndRefresh = (refresh: boolean | undefined, refreshMethod: Function) => {
    dialogEmptyClose()
    if (refresh) {
      refreshMethod()
    }
  }
  return {
    dialogEmpty,
    dialogEmptyOpen,
    dialogEmptyClose,
    dialogEmptyCloseAndRefresh,
  }
}


// 一个参数对话框
export function dialogBaseContent<T = string> () {
  const dialogBase = reactive<DialogBase<T>>({
    show: false,
    dataId: undefined,
  })
  const dialogBaseOpen = (id : UnwrapRef<T> | undefined) => {
    dialogBase.dataId = id
    dialogBase.show = true
  }
  const dialogBaseClose = () => {
    dialogBase.dataId = undefined
    dialogBase.show = false
  }
  const dialogBaseCloseAndRefresh = (refresh: boolean | undefined, refreshMethod: Function) => {
    dialogBaseClose()
    if (refresh) {
      refreshMethod()
    }
  }
  return {
    dialogBase,
    dialogBaseOpen,
    dialogBaseClose,
    dialogBaseCloseAndRefresh,
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
  const dialogParamsCloseAndRefresh = (refresh: boolean | undefined, refreshMethod: Function) => {
    dialogParamsClose()
    if (refresh) {
      refreshMethod()
    }
  }
  return {
    dialogParam,
    dialogParamsOpen,
    dialogParamsClose,
    dialogParamsCloseAndRefresh,
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