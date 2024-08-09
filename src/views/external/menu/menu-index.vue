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
      </div>

      <div class="empty-flex" />

      <el-button-group class="mgl-medium">
        <el-button
          :icon="Plus"
          type="success"
        >
          添加子菜单
        </el-button>

        <el-button
          :icon="Sort"
        >
          子菜单排序
        </el-button>

        <el-button
          :icon="Edit"
        >
          编辑
        </el-button>

        <el-button
          :icon="Delete"
        >
          删除
        </el-button>
      </el-button-group>
    </div>

    <main class="menu-main">
      <el-tree
        ref="menuElTreeRef"
        class="menu-index-tree"
        :data="dataSource"
        node-key="id"
        show-checkbox
        default-expand-all
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :check-strictly="true"
        @check-change="treeCheckChange"
      >
        <template #default="{ node }">
          <span class="custom-tree-node">
            <span class="tree-node-label">
              {{ node.label }}
            </span>
            <span>
              <el-tag
                type="warning"
                round
                size="small"
                class="mgl-medium"
              >
                不可见
              </el-tag>
              <el-tag
                type="primary"
                round
                size="small"
                class="mgl-medium"
              >
                资源：1234
              </el-tag>
              <el-tag
                type="info"
                round
                size="small"
                class="mgl-medium"
              >
                控件：32
              </el-tag>
            </span>
          </span>
        </template>
      </el-tree>
      <div class="menu-index-control">
        <h4>Level Two 1-1</h4>
        <div class="control-main">
          <el-button
            :icon="Link"
          >
            绑定资源
          </el-button>
        </div>
        <h5>菜单控件管理</h5>
        <div class="control-main">
          <p>控件管理包括菜单下的按钮、标签页、链接等，对各类控件绑定资源达到更精细的权限控制。</p>
        </div>
      </div>
    </main>
    
    <menu-add-dialog
      v-bind="dialogParam"
      @close-dialog="dialogParamsCloseAndRefresh"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {
  Delete,
  Edit,
  Link,
  Plus,
  Sort, 
  Tickets,
  PriceTag,
} from '@element-plus/icons-vue'
import MenuAddDialog from './menu-add-dialog.vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import {dialogParamsContent} from '@utils/dialogOptions'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

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
    
    let id = 1000

    const dataSource = ref<Tree[]>([
      {
        id: 1,
        label: 'Level one 1',
        children: [
          {
            id: 4,
            label: 'Level two 1-1',
            children: [
              {
                id: 9,
                label: 'Level three 1-1-1',
              },
              {
                id: 10,
                label: 'Level three 1-1-2',
              },
            ],
          },
        ],
      },
      {
        id: 2,
        label: 'Level one 2',
        children: [
          {
            id: 5,
            label: 'Level two 2-1',
          },
          {
            id: 6,
            label: 'Level two 2-2',
          },
        ],
      },
      {
        id: 3,
        label: 'Level one 3',
        children: [
          {
            id: 7,
            label: 'Level two 3-1',
          },
          {
            id: 8,
            label: 'Level two 3-2',
          },
        ],
      },
    ])

    const append = (data: Tree) => {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        data.children = []
      }
      data.children.push(newChild)
      dataSource.value = [...dataSource.value]
    }

    const remove = (node: Node, data: Tree) => {
      const parent = node.parent
      const children: Tree[] = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
      dataSource.value = [...dataSource.value]
    }

    const treeCheckChange = (data: Tree, checkNode: boolean) => {
      if (checkNode) {
        menuElTreeRef.value.setCheckedKeys([data.id])
      }
    }

      return {
        Plus,
        Tickets,
        Sort,
        Delete,
        Edit,
        Link,
        PriceTag,
        menuElTreeRef,
        dataSource,
        append,
        remove,
        treeCheckChange,

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
  display: grid;
  grid-template-columns: 1fr 400px;
  grid-column-gap: var(--mg-large);
  & .menu-index-tree{
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

  & .menu-index-control{
    border: var(--border-1);
    border-radius: var(--border-radius-medium);
    & h4,h5{
      line-height: var(--size-medium);
      border-bottom: var(--border-1);
      padding-left: var(--pd-medium);
    }
    & h5{
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