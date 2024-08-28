<template>
  <div class="menu-tree">
    <el-input
      v-model.trim="searchVal"
      class="mgb-medium"
      clearable
      placeholder="一级菜单过滤"
    >
      <template #append>
        <el-button
          :icon="Search"
          style="width: 120px"
        />
      </template>
    </el-input>

    <el-tree
      ref="menuElTreeRef"
      class="menu-index-tree"
      :class="{'tree-bd': menuTreeList && menuTreeList.length < 1}"
      :data="getMenuTreeList"
      :props="{label: 'name', children: 'children', disabled: 'disabled', class: customNodeClass}"
      node-key="id"
      show-checkbox
      default-expand-all
      :expand-on-click-node="false"
      :check-strictly="true"
      @check-change="treeCheckChange"
      @node-click="treeNodeClick"
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
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, toRef, computed} from 'vue'
import {MenuBeanVO} from './menuModel'
import {Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'MenuTree',
  props: {
    menuList: {
      type: Array<MenuBeanVO>,
      default: [],
    },
    source: {
      type: Number,
      default: 0,
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
  emits: ['set-active-menu', 'set-checked-keys'],
  setup(props, { emit }) {
    const menuTreeList = toRef(props, 'menuList')

    const menuElTreeRef = ref()
    const searchVal = ref('')
    const checkNodeMap = new Map<string, number>

    const setActiveMenu = (data: MenuBeanVO) => {
      emit('set-active-menu', {
        id: data.id,
        name: data.name,
        childrenCount: data.children ? data.children.length : 0,
      })
    }

    const treeCheckChange = (data: MenuBeanVO, checkNode: boolean) => {
      if (checkNode) {
        if (props.source === 1) {
          menuElTreeRef.value.setCheckedKeys([data.id])
          checkNodeMap.clear()
          checkNodeMap.set(data.id, data.children.length)
        } else {
          checkNodeMap.set(data.id, data.children.length)
        }
      } else {
        checkNodeMap.delete(data.id)
      }
      // 根据子节点数量排序
      const sortedMap = new Map([...checkNodeMap.entries()].sort((a, b) => a[1] - b[1]))
      emit('set-checked-keys', sortedMap)
    }

    const treeNodeClick = (data: MenuBeanVO) => {
      if (props.source === 1) {
        return
      }
      setActiveMenu(data)
    }

    const cleanActiveMenu = (cleanActive = false) => {
      menuElTreeRef.value.setCheckedKeys([])
      checkNodeMap.clear()
      emit('set-checked-keys', checkNodeMap)
      if (cleanActive) {
        emit('set-active-menu', {
          id: '',
          name: '',
          children: [],
        })
      }
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
      return null
    }


    return {
      Search,
      menuTreeList,
      getMenuTreeList,
      searchVal,
      menuElTreeRef,
      treeCheckChange,
      cleanActiveMenu,
      treeNodeClick,
      customNodeClass,
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
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    line-height: var(--size-default);
  }
}
</style>
<style lang="scss">
.menu-index-tree{
  & .el-tree-node__content, .tree-bd, .el-tree__empty-block{
    border-bottom: var(--border-1);
  }
}

.tree-move-check > .el-tree-node__content:nth-of-type(1) {
  color: var(--color-red);
}

</style>