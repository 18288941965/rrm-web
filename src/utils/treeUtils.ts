/**
 * 删除树中的节点.
 * 注：此方法仅适用删除没有下级节点的节点
 * @param tree 构建树的数据
 * @param id 要删除的节点id
 */
const deleteNodeById = (tree: Array<any>, id: string) => {
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i]

        // 如果找到匹配的节点，删除它
        if (node.id === id) {
            tree.splice(i, 1)
            return true // 返回 true 表示成功删除
        }

        // 如果有子节点，递归处理
        if (node.children && node.children.length > 0) {
            const result = deleteNodeById(node.children, id)

            // 如果在子树中删除了节点，可以停止进一步的处理
            if (result) {
                return true
            }
        }
    }
    return false // 返回 false 表示未找到节点
}

/**
 * 更新树节点或新增节点
 * @param tree 构建树的数据
 * @param id 要更新的节点ID
 * @param newData 要更新的数据对象
 * @param parentId 要更新的父节点ID
 */
const updateOrInsertNode = (tree: Array<any>, id: string, newData: any, parentId: string | null) => {
    let found = false

    function recursiveUpdate(tree: Array<any>) {
        for (let node of tree) {
            // 如果找到匹配的节点，更新它的数据
            if (node.id === id) {
                // 后端仅返回当前节点的信息，子节点信息使用历史数据
                newData.children = node.children
                Object.assign(node, newData)
                found = true
                return true // 返回 true 表示成功更新
            }

            // 如果有子节点，递归处理
            if (node.children && node.children.length > 0) {
                const result = recursiveUpdate(node.children)
                if (result) return true
            }
        }
        return false
    }

    // 先尝试更新节点
    recursiveUpdate(tree)

    // 插入到根节点
    if (!found && parentId === null) {
        // 如果没有提供 parentId，则将节点插入到根级别
        // 创建第一个菜单
        if (tree.length < 1) {
            tree.push(newData)
            return
        }
        // 把菜单插入指定位置
        let index = tree.length
        for (let i = 0; i < tree.length ; i++) {
            if (tree[i].sortOrder > newData.sortOrder) {
                index = i - 1 > -1 ? i - 1 : 0
                break
            }
        }
        tree.splice(index, 0, newData)
        return
    }

    // 如果未找到节点，则插入新的节点
    if (!found) {
        function recursiveInsert(tree: Array<any>) {
            for (let node of tree) {
                // 找到 parentId 匹配的节点，在其子节点中插入新的节点
                if (node.id === parentId) {
                    node.children = node.children || []
                    node.children.push(newData)
                    return true
                }
                // 递归检查子节点
                if (node.children && node.children.length > 0) {
                    const result = recursiveInsert(node.children)
                    if (result) return true
                }
            }
            return false
        }

        // 如果有 parentId，则递归插入到对应的父节点下
        recursiveInsert(tree)
    }
}

export {
    deleteNodeById,
    updateOrInsertNode,
}