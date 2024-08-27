<template>
  <div>
    <div class="mgb-medium menu-btn-flex">
      <div>
        <el-button
          type="success"
          :icon="Plus"
          @click="dialogParamsOpen({ dataId: '', parentId: '', parentName: '' })"
        >
          创建一级菜单
        </el-button>

        <el-button
          :icon="Upload"
        >
          导入菜单
        </el-button>

        <el-button
          :icon="Sort"
        >
          一级菜单排序
        </el-button>

        <el-button
          :icon="Right"
          @click="dialogMenuMoveOpen"
        >
          移动选中菜单
        </el-button>

        <el-button
          :icon="Delete"
          @click="deleteData"
        >
          删除选中菜单
        </el-button>
      </div>

      <div class="empty-flex" />
    </div>

    <main class="menu-main">
      <menu-tree
        ref="menuIndexTreeRef"
        :menu-list="menuList"
        @set-active-menu="treeCheckChange"
        @set-checked-keys="treeCheckMap"
      />
      
      <div class="menu-index-control">
        <div class="control-top">
          <h4>
            <span
              v-if="!activeMenu.id"
              class="no-data"
            >请点击左侧菜单名称选择要操作的菜单</span>
            {{ activeMenu.name }}
          </h4>

          <div>
            <el-button
              :disabled="!activeMenu.id"
              :icon="Plus"
              type="success"
              @click="dialogParamsOpen({ dataId: '', parentId: activeMenu.id, parentName: activeMenu.name })"
            >
              添加子菜单
            </el-button>

            <el-button
              :disabled="!activeMenu.id || activeMenu.childrenCount > 0"
              :icon="Edit"
              @click="dialogParamsOpen({ dataId: activeMenu.id, parentId: '', parentName: '' })"
            >
              编辑菜单
            </el-button>

            <el-button
              :disabled="activeMenu.childrenCount < 1"
              :icon="Sort"
            >
              子菜单排序
            </el-button>
          </div>
        </div>

        <div class="control-main">
          <p>
            唯一标识：{{ activeMenu.id }}。强烈建议资源绑定到具体的菜单上，否则容易造成权限的不可控影响。
          </p>
          <el-button
            class="mgl-medium"
            :disabled="!activeMenu.id"
            :icon="Link"
          >
            绑定资源 763 / <span class="bind-source">210</span>
          </el-button>
        </div>
        <div class="control-top control-top2">
          <h5>菜单控件管理</h5>
          <el-button
            :icon="Plus"
            :disabled="!activeMenu.id"
          >
            创建控件
          </el-button>
        </div>

        <div class="control-main">
          <p>控件管理包括菜单下的按钮、标签页、链接等，对各类控件绑定资源达到更精细的权限控制。</p>
        </div>
      </div>
    </main>
    
    <menu-add-dialog
      v-bind="dialogParam"
      @close-dialog="dialogParamsCloseAndRefresh"
    />
    
    <menu-move-drawer
      :show="dialogMenuMove.show"
      :menu-list="menuList"
      @close-dialog="dialogMenuMoveCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {Delete, Edit, Link, Plus, PriceTag, Sort, Upload, Right} from '@element-plus/icons-vue'
import MenuAddDialog from './menu-add-dialog.vue'
import {dialogEmptyContent, dialogParamsContent} from '@utils/dialogOptions'
import {MenuBeanActive, MenuBeanVO} from './menuModel'
import {deleteMenuById, getMenuById, getMenuByItemCode} from './menuOption'
import {deleteConfirm} from '@utils/utils'
import MenuTree from './menu-tree.vue'
import MenuMoveDrawer from './menu-move-drawer.vue'
import {ElMessage} from 'element-plus/es'

export default defineComponent({
  name: 'MenuIndex',
  components: {
    MenuAddDialog,
    MenuTree,
    MenuMoveDrawer,
  },
  setup() {
    const menuList = ref<Array<MenuBeanVO>>([])
    const menuIndexTreeRef = ref()
    let checkMap = new Map<string, number>
    const activeMenu = reactive<MenuBeanActive>({
      id: '',
      name: '',
      childrenCount: 0,
    })

    const treeCheckChange = (data: MenuBeanActive) => {
      Object.assign(activeMenu, data)
    }

    const treeCheckMap = (data: Map<string, number>) => {
      checkMap = data
    }

    const query = () => {
      getMenuByItemCode().then(res => {
        if (res.code === 200) {
          menuList.value = res.data
        }
      })
    }

    const deleteNodeById = (tree: Array<MenuBeanVO>, id: string) => {
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

    const findChildrenIds = (tree: Array<MenuBeanVO>, targetId: string) => {
      const result: Array<string> = []

      // 递归遍历树，找到目标节点及其子节点的所有id
      function traverse(node: MenuBeanVO) {
        if (node.id === targetId) {
          collectIds(node)
        } else if (node.children) {
          node.children.forEach(child => traverse(child))
        }
      }

      // 收集所有子节点的id
      function collectIds(node: MenuBeanVO) {
        if (!node) return
        result.push(node.id)
        if (node.children) {
          node.children.forEach(child => collectIds(child))
        }
      }

      // 遍历整个树
      tree.forEach(rootNode => traverse(rootNode))
      return result.slice(1)
    }
    
    const deleteData = () => {
      if (checkMap.size === 0) {
        ElMessage.warning('未选中菜单！')
        return
      }
      const deleteIds: Array<string> = []

      for (let key of checkMap.keys()) {
        const val = checkMap.get(key) as number
        if (val <= 0) {
          deleteIds.push(key)
          continue
        }

        const childIds = findChildrenIds(menuList.value, key)
        for (let i = 0; i < childIds.length; i++) {
          if (!checkMap.has(childIds[i])) {
            ElMessage.warning('请一并选择要删除菜单的所有子菜单！')
            return
          }
        }
        deleteIds.push(key)
      }

      deleteConfirm('你确定要删除所有选中菜单吗？菜单关联项也将被一并删除').then(data => {
        if (data) {
          deleteMenuById(deleteIds.join(',')).then(res => {
            if (res.code == 200) {
              deleteIds.forEach(id => {
                deleteNodeById(menuList.value, id)
              })
              if (checkMap.has(activeMenu.id)) {
                menuIndexTreeRef.value!.cleanActiveMenu(true)
              }
            }
          })
        }
      })
    }

    const {
      dialogParam,
      dialogParamsOpen,
      dialogParamsClose,
    } = dialogParamsContent()


    const updateOrInsertNode = (tree: Array<MenuBeanVO>, id: string, newData: MenuBeanVO, parentId: string | null) => {
      let found = false

      function recursiveUpdate(tree: Array<MenuBeanVO>) {
        for (let node of tree) {
          // 如果找到匹配的节点，更新它的数据
          if (node.id === id) {
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
        function recursiveInsert(tree: Array<MenuBeanVO>) {
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

    const dialogParamsCloseAndRefresh = (refresh: boolean, editId: string) => {
      dialogParamsClose()
      if (refresh) {
        getMenuById(editId).then(res => {
          if (res.code === 200) {
            const data: MenuBeanVO = res.data
            updateOrInsertNode(menuList.value, editId, data, data.parentId)
            if (editId === activeMenu.id) {
              Object.assign(activeMenu, {
                name: data.name,
              })
            }
          }
        })
      }
    }

    const {
      dialogEmpty: dialogMenuMove,
      dialogEmptyOpen,
      dialogEmptyCloseAndRefresh: dialogMenuMoveCloseAndRefresh,
    } = dialogEmptyContent()
    const dialogMenuMoveOpen = () => {
      if (checkMap.size === 0) {
        ElMessage.warning('未选中菜单！')
        return
      }
      dialogEmptyOpen()
    }

    onMounted(() => {
      query()
    })

      return {
        Plus,
        Upload,
        Sort,
        Delete,
        Edit,
        Link,
        PriceTag,
        Right,

        activeMenu,
        menuList,
        treeCheckChange,
        treeCheckMap,
        menuIndexTreeRef,

        query,
        deleteData,

        dialogParam,
        dialogParamsOpen,
        dialogParamsCloseAndRefresh,

        dialogMenuMove,
        dialogMenuMoveOpen,
        dialogMenuMoveCloseAndRefresh,
      }
  },
})
</script>

<style scoped lang="scss">
.menu-btn-flex{
  display: flex;
}

.menu-main{
  display: grid;
  grid-template-columns: 560px 1fr;
  align-items: flex-start;

  & .menu-index-control{
    border: var(--border-1);
    border-radius: var(--border-radius-medium);
    & .control-top{
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: var(--size-medium);
      border-bottom: var(--border-1);
      padding-left: var(--pd-medium);
      padding-right: var(--pd-ultra-small);
    }
    & .control-top2{
      border-top: var(--border-1);
    }
    & .control-main{
      padding: var(--pd-medium);
      & .bind-source{
        padding-left: var(--pd-ultra-small);
        font-weight: bolder;
        color: var(--color-blue);
      }
      & p{
        text-indent: 2rem;
        color: var(--color-black-secondary);
      }
    }
  }
}

</style>
