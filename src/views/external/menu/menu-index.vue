<template>
  <div>
    <el-button
      class="mgb-medium"
      type="success"
      :icon="Plus"
    >
      创建一级菜单
    </el-button>

    <el-button
      class="mgb-medium"
      :icon="Tickets"
    >
      导入菜单
    </el-button>

    <el-button
      class="mgb-medium"
      :icon="Sort"
    >
      一级菜单排序
    </el-button>
    
    <el-tree
      class="menu-index-tree"
      :data="dataSource"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span class="tree-node-label">
            {{ node.label }}
            <el-tag
              type="warning"
              round
              size="small"
              class="mgl-medium"
            >不可见</el-tag>
          </span>
          <span>
            <el-button
              v-if="!data.children || data.children.length === 0"
              :icon="Link"
            >
              绑定资源
              <span class="custom-badge">123</span>
            </el-button>
            <el-button
              v-if="data.children && data.children.length > 0"
              :icon="Sort"
            >
              子菜单排序
            </el-button>
            <el-button
              :icon="Plus"
              type="success"
              plain
            >
              添加子菜单
            </el-button>
            <el-button
              :icon="Edit"
              plain
            />

            <el-button
              v-if="!data.children || data.children.length === 0"
              type="danger"
              plain
              :icon="Delete"
            />
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {
  Plus,
    Tickets,
    Sort,
    Delete,
    Edit,
    Link,
} from '@element-plus/icons-vue'
import type Node from 'element-plus/es/components/tree/src/model/node'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

export default defineComponent({
  name: 'MenuIndex',
  setup() {

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

      return {
        Plus,
        Tickets,
        Sort,
        Delete,
        Edit,
        Link,
        dataSource,
        append,
        remove,
      }
  },
})
</script>


<style scoped lang="scss">
.menu-index-tree{
  border: var(--border-1);
  border-bottom: 0;
  border-radius: var(--border-radius-medium);
  & .el-tree-node__content{
    border-bottom: var(--border-1);
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  line-height: var(--size-default);
}

.custom-badge{
  background-color: var(--color-blue);
  color: var(--color-white);
  padding: 1px 4px;
  margin-left: var(--mg-ultra-small);
  border-radius: 6px;
}
</style>
<style lang="scss">
.menu-index-tree{
  & .el-tree-node__content{
    border-bottom: var(--border-1);
  }
}
</style>