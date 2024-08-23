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
          :icon="Tickets"
        >
          导入菜单
        </el-button>

        <el-button
          :icon="Sort"
        >
          一级菜单排序
        </el-button>

        <el-button
          :disabled="!activeMenu.id && activeMenu.childrenCount < 1"
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
        >
          子菜单排序
        </el-button>
      </div>

      <div class="empty-flex" />
    </div>

    <main class="menu-main">
      <el-tree
        ref="menuElTreeRef"
        class="menu-index-tree"
        :class="{'tree-bd': menuList.length < 1}"
        :data="menuList"
        :props="{label: 'name', children: 'children'}"
        node-key="id"
        show-checkbox
        default-expand-all
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :check-strictly="true"
        @check-change="treeCheckChange"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span class="tree-node-label">
              {{ node.label }}
            </span>
            <span>
              <el-tag
                v-if="!data.visibility"
                type="warning"
                round
                size="small"
                class="mgl-medium"
              >
                不可见
              </el-tag>
            </span>
          </span>
        </template>
      </el-tree>
      <div class="menu-index-control">
        <div class="control-top">
          <h4>
            <span v-if="!activeMenu.id">未选中菜单</span>
            {{ activeMenu.name }}
          </h4>
          <el-button :icon="Right">
            移动到指定菜单下
          </el-button>
        </div>

        <div class="control-main">
          <el-button
            :disabled="!activeMenu.id"
            :icon="Link"
          >
            绑定资源
          </el-button>
        </div>
        <div class="control-top control-top2">
          <h5>菜单控件管理</h5>
          <el-button :icon="Plus">
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
      @close-dialog="dialogParamsCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {Delete, Edit, Link, Plus, PriceTag, Sort, Tickets, Right} from '@element-plus/icons-vue'
import MenuAddDialog from './menu-add-dialog.vue'
import {dialogParamsContent} from '@utils/dialogOptions'
import {MenuBeanActive, MenuBeanVO} from './menuModel'
import {deleteMenuById, getMenuByItemCode} from './menuOption'
import {deleteConfirm} from '@utils/utils'

export default defineComponent({
  name: 'MenuIndex',
  components: {
    MenuAddDialog,
  },
  setup() {
    const menuElTreeRef = ref()
    const {
      dialogParam,
        dialogParamsOpen,
        dialogParamsCloseAndRefresh,
    } = dialogParamsContent()
    
    const menuList = ref<Array<MenuBeanVO>>([])
    const activeMenu = reactive<MenuBeanActive>({
      id: '',
      name: '',
      childrenCount: 0,
    })
    const clearActiveMenu = () => {
      Object.assign(activeMenu, {
        id: '',
        name: '',
        childrenCount: 0,
      })
    }
    
    const treeCheckChange = (data: MenuBeanVO, checkNode: boolean) => {
      if (checkNode) {
        menuElTreeRef.value.setCheckedKeys([data.id])
        Object.assign(activeMenu, {
          id: data.id,
          name: data.name,
          childrenCount: data.children ? data.children.length : 0,
        })
      }
    }

    const query = () => {
      getMenuByItemCode().then(res => {
        if (res.code === 200) {
          menuList.value = res.data
        }
      })
    }

    const deleteData = () => {
      deleteConfirm('你确定要删除此菜单吗？菜单关联项也将被一并删除').then(data => {
        if (data) {
          deleteMenuById(activeMenu.id).then(res => {
            if (res.code == 200) {
              query()
              clearActiveMenu()
            }
          })
        }
      })
    }


    onMounted(() => {
      query()
    })

      return {
        Plus,
        Tickets,
        Sort,
        Delete,
        Edit,
        Link,
        PriceTag,
        Right,

        activeMenu,
        menuList,
        menuElTreeRef,
        treeCheckChange,

        query,
        deleteData,

        dialogParam,
        dialogParamsOpen,
        dialogParamsCloseAndRefresh,
      }
  },
})
</script>


<style scoped lang="scss">
.menu-btn-flex{
  display: flex;
}

.menu-main{
  display: flex;
  align-items: flex-start;
  & .menu-index-tree{
    flex: 1;
    margin-right: var(--mg-medium);
    border: var(--border-1);
    border-bottom: 0;
    border-radius: var(--border-radius-medium);
    & .el-tree-node__content{
      border-bottom: var(--border-1);
    }

    & .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 8px;
      line-height: var(--size-default);
    }
  }
  & .tree-bd{
    border-bottom: var(--border-1);;
  }

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
      & p{
        text-indent: 2rem;
        color: var(--color-black-secondary);
      }
    }
  }
}

</style>
<style lang="scss">
.menu-index-tree{
  & .el-tree-node__content{
    border-bottom: var(--border-1);
  }
}
</style>