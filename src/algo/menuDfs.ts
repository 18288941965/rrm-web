import {MenuBean} from '../views/theme/menu/menuModels'

let found = false
let nodeDepth = 0

/**
 * 暴力递归遍历
 * @param menuNode 菜单节点对象
 * @param condition 搜索的菜单[ID | URL]
 * @param visited 已经搜索过的菜单ID
 * @param prev 节点层级关系
 * @param _nodeDepth 树的深度
 */
const recurDfs = (menuNode: MenuBean, condition: string, visited: Map<String, boolean>, prev: MenuBean[], _nodeDepth: number) => {
    if (found) {
        return
    }

    nodeDepth = _nodeDepth
    prev[_nodeDepth] = menuNode

    visited.set(menuNode.id, true)
    if (menuNode.id === condition || menuNode.url === condition) {
        found = true
        return
    }
    if (!menuNode.children || found) {
        return
    }
    for (let i = 0; i < menuNode.children.length; i++) {
        if (found) {
            break
        }
        const obj = menuNode.children[i]
        if (!visited.get(obj.id)) {
            recurDfs(obj, condition, visited, prev, _nodeDepth + 1)
        }
    }
}

/**
 * 深度优先搜索
 * @param menus 要搜索的菜单根节点 --> 包含children
 * @param condition 搜索的菜单[ID | URL]
 * @param containRoot 是否包含根节点
 */
const menuDfs = (menus: MenuBean, condition: string, containRoot = false) => {
    found = false
    nodeDepth = 0
    const visited = new Map<String, boolean>()
    let prev: MenuBean[] = []
    recurDfs(menus, condition, visited, prev, 0)
    // 这里需要高版本的浏览器才支持，具体参照官网
    // structuredClone(prev)
    // 低版本请使用：prev = JSON.parse(JSON.stringify(prev))
    prev = JSON.parse(JSON.stringify(prev))
    // 删除子节点，避免传递了大量无用数据
    prev.forEach(item => {
        item.children = undefined
    })
    return found? (containRoot ? prev.slice(0, nodeDepth + 1) : prev.slice(1, nodeDepth + 1)) : []
}

export default menuDfs