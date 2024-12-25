// 获取模块图标
import {ElMessageBox} from 'element-plus'
import {h} from 'vue'

export const getModuleIconUrl = (fileName: string) => {
  return new URL(`../assets/image/moduleicon/${fileName}`, import.meta.url).href
}

// 获取模块图标
export const getModuleLogoUrl = (fileName: string) => {
  return new URL(`../assets/image/desktop/${fileName}`, import.meta.url).href
}

// 关闭Details
export const closeDetails = (id: string) => {
  const elementById = document.getElementById(id)
  if (elementById && elementById.hasAttribute('open')) {
    elementById.removeAttribute('open')
  }
}

// 删除确认提示
export const deleteConfirm = async (message: string) => {
  return await ElMessageBox.confirm(
      message,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      },
  ).catch(() => {})
}

// 其他操作确认
export const operationConfirm = async (message: string) => {
    return await ElMessageBox.confirm(
        message,
        '操作确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        },
    ).catch(() => {})
}

// 删除确认提示
export const deleteConfirmContent = async (message: string, title: string) => {
    return await ElMessageBox({
        title: '删除确认',
        type: 'warning',
        message: h('p', null, [
            h('span', { style: 'color: red; display: block; font-weight: bolder' }, title),
            h('span', null, message),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
    }).catch(() => {})
}



// 合并表单对象，仅合并target中存在的字段
export const assignExistingFields = (target: any, sources: any) => {
    if (sources === null || Object.keys(sources).length < 1) {
        return
    }
    const keys = Object.keys(target)
    for (let sourcesKey in sources) {
        if (keys.includes(sourcesKey)) {
            target[sourcesKey] = sources[sourcesKey]
        }
    }
}