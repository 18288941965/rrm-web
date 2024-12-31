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
      </div>

      <div class="empty-flex" />

      <div>
        <el-button
          :disabled="!activeTreeNode.id"
          :icon="Plus"
          type="success"
          @click="dialogParamsOpen({ 
            dataId: '', 
            parentId: activeTreeNode.id, 
            parentName: activeTreeNode.name, 
            terminal: activeTreeNode.terminal, 
            netType: activeTreeNode.netType 
          })"
        >
          添加子菜单
        </el-button>

        <el-button
          :disabled="!activeTreeNode.id"
          :icon="Edit"
          @click="dialogParamsOpen({ dataId: activeTreeNode.id, parentId: '', parentName: '' })"
        >
          编辑菜单
        </el-button>

        <el-button
          :disabled="!activeTreeNode.id || activeTreeNode.childrenCount >= 1"
          :icon="Delete"
          @click="deleteData"
        >
          删除菜单
        </el-button>
        
        <el-button
          :disabled="activeTreeNode.childrenCount < 1"
          :icon="Sort"
          @click="dialogSortOpen(activeTreeNode.id)"
        >
          子菜单排序
        </el-button>

        <el-button
          :disabled="!activeTreeNode.id"
          :icon="Right"
          @click="dialogMenuMoveOpen"
        >
          移动菜单
        </el-button>
      </div>
    </div>

    <main class="menu-main">
      <menu-tree
        ref="menuIndexTreeRef"
        :menu-list="menuList"
        @set-active-menu="setActiveTreeNode"
      />
      
      <div class="menu-index-control">
        <div class="control-top">
          <h4>
            <span
              v-if="!activeTreeNode.id"
              class="no-data"
            >请点击左侧菜单名称进行后续操作</span>
            {{ activeTreeNode.name }}
          </h4>

          <div>
            <el-switch
              v-model="activeTreeNode.status"
              :disabled="!activeTreeNode.id"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="停用"
              class="mgr-medium"
              @change="updateStatus"
            />
          </div>
        </div>

        <div class="control-main">
          <p>
            ID：{{ activeTreeNode.id }}。强烈建议资源绑定到具体的菜单上，否则容易造成权限的不可控影响。
          </p>
          <el-button
            class="mgl-medium"
            :disabled="!activeTreeNode.id"
            :icon="Link"
            @click="dialogBindResourceOpen({ dataId: activeTreeNode.id, name: activeTreeNode.name, type: '01' })"
          >
            绑定资源 {{ resourceCount }} / <span class="bind-source">{{ activeTreeNode.bindResourceCount }}</span>
          </el-button>

          <template v-if="activeTreeNode.id">
            <el-tag
              type="info"
              class="mgl-medium"
            >
              {{ activeTreeNode.visibility === 1 ? '可见' : '不可见' }}
            </el-tag>

            <el-tag
              type="info"
              class="mgl-medium"
            >
              {{ activeTreeNode.typeName }}
            </el-tag>

            <el-tag
              type="info"
              class="mgl-medium"
            >
              {{ activeTreeNode.terminalName }}
            </el-tag>

            <el-tag
              type="info"
              class="mgl-medium"
            >
              {{ activeTreeNode.netTypeName }}
            </el-tag>
          </template>
        </div>

        <menu-element
          :active-menu="activeTreeNode"
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
      :menu-list="getMoveMenuList"
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
import {computed, defineComponent, onMounted, reactive, ref} from 'vue'
import {Delete, Edit, Link, Plus, PriceTag, Right, Sort, Upload} from '@element-plus/icons-vue'
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
import MenuElement from './menu-element.vue'
import {countResourceByItemCode} from '../resource/resourceOption'
import ResourceSelectDialog from '../resource/resource-select-dialog.vue'
import {deleteNodeById, updateOrInsertNode} from '@utils/treeUtils'

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

    const query = () => {
      cleanActiveTreeNode()
      menuIndexTreeRef.value!.cleanTreeActiveId()
      getMenuByItemCode().then(res => {
        if (res.code === 200) {
          menuList.value = res.data
        }
      })
    }

    // ====== S ====== - 树节点点击事件
    const activeTreeNode = reactive<MenuBeanActive>({
      id: '',
      name: '',
      status: 0,
      visibility: 0,
      typeName: '',
      terminal: '',
      terminalName: '',
      netType: '',
      netTypeName: '',
      childrenCount: 0,
      bindResourceCount: 0,
    })
    const cleanActiveTreeNode = () => {
      Object.assign(activeTreeNode, {
        id: '',
        name: '',
        status: 0,
        visibility: 0,
        typeName: '',
        terminal: '',
        terminalName: '',
        netType: '',
        netTypeName: '',
        childrenCount: 0,
        bindResourceCount: 0,
      })
    }
    const setActiveTreeNode = (data: MenuBeanVO) => {
      Object.assign(activeTreeNode, {
        id: data.id,
        name: data.name,
        status: data.status,
        visibility: data.visibility,
        typeName: data.typeName,
        terminal: data.terminal,
        terminalName: data.terminalName,
        netType: data.netType,
        netTypeName: data.netTypeName,
        childrenCount: data.childrenCount,
        bindResourceCount: 0,
      })
      countMenuBindResourceByMenuId(activeTreeNode.id).then(res => {
        if (res.code === 200) {
          activeTreeNode.bindResourceCount = res.data
        }
      })
    }
    // ====== E ====== - 树节点点击事件

    // ====== S ====== - 新增和编辑
    const {
      dialogParam,
      dialogParamsOpen,
      dialogParamsClose,
    } = dialogParamsContent()
    const updateTreeNode = (editId: string) => {
      getMenuById(editId).then(res => {
        if (res.code === 200) {
          const data: MenuBeanVO = res.data
          updateOrInsertNode(menuList.value, editId, data, data.parentId)
          // 编辑菜单更新右侧内容
          if (editId === activeTreeNode.id) {
            setActiveTreeNode(data)
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
      updateMenuStatus(activeTreeNode.status, activeTreeNode.id).then(res => {
        if (res.code === 200) {
          updateTreeNode(activeTreeNode.id)
        }
      })
    }
    // ====== E ====== - 新增和编辑

    // ====== S ====== - 移动
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
    const getMoveMenuList = computed(() => {
      return menuList.value.filter(item => item.terminal === activeTreeNode.terminal && item.netType === activeTreeNode.netType)
    })
    const moveIds = ref<Array<string>>([])
    const disabledIds = ref<Array<string>>([])
    const {
      dialogEmpty: dialogMenuMove,
      dialogEmptyOpen,
      dialogEmptyClose,
    } = dialogEmptyContent()
    const dialogMenuMoveOpen = () => {
      const tmpSet = new Set<string>()
      moveIds.value.push(activeTreeNode.id)
      tmpSet.add(activeTreeNode.id)
      const childrenIds = findChildrenIds(menuList.value, activeTreeNode.id)
      childrenIds.forEach(item => tmpSet.add(item))
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
    // ====== E ====== - 移动

    // ====== S ====== - 菜单绑定资源
    const {
      dialogParam: dialogBindResource,
      dialogParamsOpen: dialogBindResourceOpen,
      dialogParamsClose: dialogBindResourceClose,
    } = dialogParamsContent()
    const dialogBindResourceCloseAndRefresh = (refresh: boolean, size: number) => {
      dialogBindResourceClose()
      if (refresh) {
        activeTreeNode.bindResourceCount = size
      }
    }
    // ====== E ====== - 菜单绑定资源

    const {
      dialogBase: dialogSort,
      dialogBaseOpen: dialogSortOpen,
      dialogBaseCloseAndRefresh: dialogSortCloseAndRefresh,
    } = dialogBaseContent()

    const deleteData = () => {
      deleteConfirmContent('建议停用菜单而不是删除，删除后将不可恢复，是否确认执行删除操作', activeTreeNode.name).then(data => {
        if (data) {
          deleteMenuById(activeTreeNode.id).then(res => {
            if (res.code == 200) {
              deleteNodeById(menuList.value, activeTreeNode.id)

              cleanActiveTreeNode()
              menuIndexTreeRef.value!.cleanTreeActiveId()
            }
          })
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

        activeTreeNode,
        menuList,
        deleteData,
        updateStatus,

        setActiveTreeNode,
        menuIndexTreeRef,

        dialogParam,
        dialogParamsOpen,
        dialogParamsCloseAndRefresh,

        moveIds,
        disabledIds,
        getMoveMenuList,
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
