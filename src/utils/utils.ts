// 获取模块图标
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