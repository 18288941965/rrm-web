<template>
  <div class="menu-tree">
    <el-input
      v-model.trim="searchVal"
      class="mgb-medium"
      clearable
      placeholder="菜单过滤"
    />

    <el-tree
      ref="menuTreeRef"
      class="menu-index-tree"
      :class="{'tree-bd': menuTreeList && menuTreeList.length < 1}"
      :data="getMenuTreeList"
      :props="{label: 'name', children: 'children', disabled: 'disabled', class: customNodeClass}"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :check-strictly="true"
      :filter-node-method="filterNode"
      @node-click="treeNodeClick"
    >
      <template #default="{ node, data }">
        <span
          class="custom-tree-node"
          :class="{'tree-node-click': data.id === treeActiveId }"
        >
          <span class="tree-node-label">
            {{ node.label }}
          </span>
          <span>
            <el-tag
              v-if="data.visibility === 0"
              type="warning"
              round
              size="small"
              class="mgl-medium"
            >
              不可见
            </el-tag>
            
            <el-tag
              v-if="data.status !== 1"
              type="danger"
              round
              size="small"
              class="mgl-medium"
            >
              停用
            </el-tag>
            
            <el-tag
              v-if="node.level <= 1"
              type="warning"
              round
              size="small"
              class="mgl-medium"
            >
              {{ data.terminalName }}
            </el-tag>
            
            <el-tag
              v-if="node.level <= 1"
              type="warning"
              round
              size="small"
              class="mgl-medium"
            >
              {{ data.netTypeName }}
            </el-tag>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, watch, ref, toRef} from 'vue'
import {MenuBeanVO} from './menuModel'

export default defineComponent({
  name: 'MenuTree',
  props: {
    menuList: {
      type: Array<MenuBeanVO>,
      default: [],
    },
    moveIds: {
      type: Array<string>,
      default: [],
    },
    disabledIds: {
      type: Array<string>,
      default: [],
    },
  },
  emits: ['set-active-menu'],
  setup(props, { emit }) {
    const menuTreeList = toRef(props, 'menuList')

    const menuTreeRef = ref()
    const searchVal = ref('')
    const treeActiveId = ref('')

    const setActiveMenu = (data: MenuBeanVO) => {
      // 深拷贝去掉 children
      const childrenCount = data.children ? data.children.length : 0
      const nodeCopy: MenuBeanVO = { ...data, children: [], childrenCount }
      emit('set-active-menu', nodeCopy)
      treeActiveId.value = data.id
    }

    const treeNodeClick = (data: MenuBeanVO) => {
      // 菜单移动
      if ((props.moveIds && props.moveIds.includes(data.id))
      ||
          (props.disabledIds && props.disabledIds.includes(data.id))
      ) {
        return
      }
      setActiveMenu(data)
    }

    const cleanTreeActiveId = () => {
      treeActiveId.value = ''
    }

    const setDisabledMenu = (tree: Array<MenuBeanVO>) => {
      tree.forEach(menu => {
        if (props.disabledIds.includes(menu.id)) {
          menu.disabled = true
        }
        if (menu.children) {
          setDisabledMenu(menu.children)
        }
      })
    }

    const getMenuTreeList = computed(() => {
      if (props.moveIds.length === 0) {
        return menuTreeList.value
      }
      const newData = JSON.parse(JSON.stringify(menuTreeList.value))
      setDisabledMenu(newData)
      return newData
    })

    const customNodeClass = (data: MenuBeanVO) => {
      if (props.moveIds.includes(data.id)) {
        return 'tree-move-check'
      }
      if (props.disabledIds.includes(data.id)) {
        return 'tree-disabled-select'
      }
      return null
    }

    watch(searchVal, (val) => {
      menuTreeRef.value!.filter(val)
    })

    const filterNode = (value: string, data: MenuBeanVO) => {
      if (!value) return true
      return data.name.includes(value)
    }

    return {
      treeActiveId,
      menuTreeList,
      getMenuTreeList,
      searchVal,
      menuTreeRef,
      cleanTreeActiveId,
      treeNodeClick,
      customNodeClass,
      filterNode,
    }
  },
})
</script>



<style scoped lang="scss">
.menu-tree{
  flex: 1;
  margin-right: var(--mg-medium);
}

.menu-index-tree{
  border: var(--border-1);
  border-bottom: 0;
  border-radius: var(--border-radius-medium);
  & .el-tree-node__content{
    border-bottom: var(--border-1);
  }

  & .custom-tree-node {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    border-right: 2px solid transparent;
  }

  & .tree-node-click{
    background-image: linear-gradient(to right, transparent, #ddedfd);
    border-right-color: #409eff;
  }
}
</style>
<style lang="scss">
.menu-index-tree{
  & .el-tree-node__content, .tree-bd, .el-tree__empty-block{
    border-bottom: var(--border-1);
  }
}

.tree-move-check > .el-tree-node__content, .tree-disabled-select > .el-tree-node__content{
  cursor: not-allowed;
}

.tree-move-check > .el-tree-node__content:nth-of-type(1) {
  color: var(--color-red);
}

.tree-disabled-select > .el-tree-node__content:nth-of-type(1) {
  color: var(--el-disabled-text-color);
}

</style>