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
          :icon="Sort"
          @click="dialogSortOpen(undefined)"
        >
          一级菜单排序
        </el-button>

        <el-button
          :icon="Right"
          @click="dialogMenuMoveOpen"
        >
          移动选中菜单
        </el-button>
      </div>

      <div class="empty-flex" />

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
          :disabled="activeMenu.childrenCount < 1"
          :icon="Sort"
          @click="dialogSortOpen(activeMenu.id)"
        >
          子菜单排序
        </el-button>
      </div>
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
            >请点击左侧菜单名称进行后续操作</span>
            {{ activeMenu.name }}
          </h4>

          <div>
            <el-switch
              v-model="activeMenu.status"
              :disabled="!activeMenu.id || activeMenu.childrenCount > 1"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="停用"
              class="mgr-medium"
              @change="updateStatus"
            />
            
            <el-button
              :disabled="!activeMenu.id || activeMenu.childrenCount > 1"
              :icon="Delete"
              @click="deleteData"
            >
              删除菜单
            </el-button>

            <el-button
              :disabled="!activeMenu.id"
              :icon="Edit"
              @click="dialogParamsOpen({ dataId: activeMenu.id, parentId: '', parentName: '' })"
            >
              编辑菜单
            </el-button>
          </div>
        </div>

        <div class="control-main">
          <p>
            ID：{{ activeMenu.id }}。强烈建议资源绑定到具体的菜单上，否则容易造成权限的不可控影响。
          </p>
          <el-button
            class="mgl-medium"
            :disabled="!activeMenu.id"
            :icon="Link"
            @click="dialogBindResourceOpen({ dataId: activeMenu.id, name: activeMenu.name, type: '01' })"
          >
            绑定资源 {{ resourceCount }} / <span class="bind-source">{{ activeMenu.bindResourceCount }}</span>
          </el-button>
        </div>

        <menu-element
          :active-menu="activeMenu"
          :resource-count="resourceCount"
        />
      </div>
    </main>
    
    <menu-add-dialog
      v-bind="dialogParam"
      @close-dialog="dialogParamsCloseAndRefresh"
    />
    
    <menu-move-drawer
      :show="dialogMenuMove.show"
      :menu-list="menuList"
      :move-ids="moveIds"
      :disabled-ids="disabledIds"
      @close-dialog="dialogMenuMoveCloseAndRefresh"
    />
    
    <menu-sort-dialog
      v-bind="dialogSort"
      @close-dialog="dialogSortCloseAndRefresh($event, query)"
    />

    <resource-select-dialog
      v-bind="dialogBindResource"
      @close-dialog="dialogBindResourceCloseAndRefresh"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {Delete, Edit, Link, Plus, PriceTag, Sort, Upload, Right} from '@element-plus/icons-vue'
import MenuAddDialog from './menu-add-dialog.vue'
import {dialogBaseContent, dialogEmptyContent, dialogParamsContent} from '@utils/dialogOptions'
import {MenuBeanActive, MenuBeanVO} from './menuModel'
import {
  countMenuBindResourceByMenuId,
  deleteMenuById,
  getMenuById,
  getMenuByItemCode,
  updateMenuStatus,
} from './menuOption'
import {deleteConfirmContent} from '@utils/utils'
import MenuTree from './menu-tree.vue'
import MenuMoveDrawer from './menu-move-drawer.vue'
import MenuSortDialog from './menu-sort-dialog.vue'
import {ElMessage} from 'element-plus/es'
import MenuElement from './menu-element.vue'
import {countResourceByItemCode} from '../resource/resourceOption'
import ResourceSelectDialog from '../resource/resource-select-dialog.vue'

export default defineComponent({
  name: 'MenuIndex',
  components: {
    MenuAddDialog,
    MenuTree,
    MenuMoveDrawer,
    MenuSortDialog,
    MenuElement,
    ResourceSelectDialog,
  },
  setup() {
    const menuList = ref<Array<MenuBeanVO>>([])
    const menuIndexTreeRef = ref()
    const resourceCount = ref(0)

    // 右侧激活的菜单
    const activeMenu = reactive<MenuBeanActive>({
      id: '',
      name: '',
      status: 0,
      childrenCount: 0,
      bindResourceCount: 0,
    })
    const treeCheckChange = (data: MenuBeanActive) => {
      Object.assign(activeMenu, data)
      if (!activeMenu.id) {
        activeMenu.bindResourceCount = 0
        return
      }
      countMenuBindResourceByMenuId(activeMenu.id).then(res => {
        if (res.code === 200) {
          activeMenu.bindResourceCount = res.data
        }
      })
    }

    // 选中的菜单
    const checkMap = ref<Array<{
      id: string
      count: number
    }>>([])
    const treeCheckMap = (data: Map<string, number>) => {
      checkMap.value = []
      for (let key of data.keys()) {
        checkMap.value.push({ id: key, count: data.get(key) as number })
      }
    }

    // ————————删除————————start
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

    const deleteData = () => {
      deleteConfirmContent('建议停用菜单而不是删除，删除后将不可恢复，是否确认执行删除操作', activeMenu.name).then(data => {
        if (data) {
          deleteMenuById(activeMenu.id).then(res => {
            if (res.code == 200) {
              deleteNodeById(menuList.value, activeMenu.id)

              menuIndexTreeRef.value!.cleanActiveMenu(true)
            }
          })
        }
      })
    }
    // ————————删除————————end

    // ————————新增、编辑————————start
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
    const updateTreeNode = (editId: string) => {
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
    const dialogParamsCloseAndRefresh = (refresh: boolean, editId: string) => {
      dialogParamsClose()
      if (refresh) {
        updateTreeNode(editId)
      }
    }
    const updateStatus = () => {
      updateMenuStatus(activeMenu.status, activeMenu.id).then(res => {
        if (res.code === 200) {
          updateTreeNode(activeMenu.id)
        }
      })
    }
    // ————————新增、编辑————————end

    // ————————菜单移动————————start
    const moveIds = ref<Array<string>>([])
    const disabledIds = ref<Array<string>>([])
    const {
      dialogEmpty: dialogMenuMove,
      dialogEmptyOpen,
      dialogEmptyClose,
    } = dialogEmptyContent()
    const dialogMenuMoveOpen = () => {
      if (checkMap.value.length === 0) {
        ElMessage.warning('未选中菜单！')
        return
      }
      const tmpSet = new Set<string>()
      moveIds.value = checkMap.value.map(item => item.id)
      checkMap.value.forEach(item => {
        tmpSet.add(item.id)
        const childrenIds = findChildrenIds(menuList.value, item.id)
        childrenIds.forEach(item => tmpSet.add(item))
      })
      disabledIds.value = Array.of(...tmpSet)
      dialogEmptyOpen()
    }
    const dialogMenuMoveCloseAndRefresh = (refresh: boolean | undefined) => {
      dialogEmptyClose()
      moveIds.value = []
      disabledIds.value = []
      if (refresh) {
        query()
      }
    }
    // ————————菜单移动————————end

    // ————————菜单排序————————start
    const {
      dialogBase: dialogSort,
        dialogBaseOpen: dialogSortOpen,
        dialogBaseCloseAndRefresh: dialogSortCloseAndRefresh,
    } = dialogBaseContent()
    // ————————菜单排序————————end

    // ————————菜单绑定资源————————start
    const {
      dialogParam: dialogBindResource,
        dialogParamsOpen: dialogBindResourceOpen,
        dialogParamsClose: dialogBindResourceClose,
    } = dialogParamsContent()
    const dialogBindResourceCloseAndRefresh = (refresh: boolean, size: number) => {
      dialogBindResourceClose()
      if (refresh) {
        activeMenu.bindResourceCount = size
      }
    }
    // ————————菜单绑定资源————————end

    const query = () => {
      menuIndexTreeRef.value!.cleanActiveMenu(true)
      getMenuByItemCode().then(res => {
        if (res.code === 200) {
          menuList.value = res.data
        }
      })
    }

    onMounted(() => {
      query()

      countResourceByItemCode().then(res => {
        if (res.code === 200) {
          resourceCount.value = res.data
        }
      })
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
        deleteData,
        updateStatus,

        treeCheckChange,
        treeCheckMap,
        menuIndexTreeRef,

        dialogParam,
        dialogParamsOpen,
        dialogParamsCloseAndRefresh,

        moveIds,
        disabledIds,
        dialogMenuMove,
        dialogMenuMoveOpen,
        dialogMenuMoveCloseAndRefresh,

        query,
        dialogSort,
        dialogSortOpen,
        dialogSortCloseAndRefresh,

        dialogBindResource,
        dialogBindResourceOpen,
        dialogBindResourceCloseAndRefresh,

        resourceCount,
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
    & .control-main{
      padding: var(--pd-medium);
      & p{
        text-indent: 2rem;
        color: var(--color-black-secondary);
      }
      & .bind-source{
        padding-left: var(--pd-ultra-small);
        font-weight: bolder;
      }
    }
  }
}

</style>
