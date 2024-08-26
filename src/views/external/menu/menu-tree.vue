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
      :class="{'tree-bd': menuList && menuList.length < 1}"
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
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
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
  },
  emits: ['set-active-menu'],
  setup(props, { emit }) {
    const menuElTreeRef = ref()
    const searchVal = ref('')

    const setActiveMenu = (data: MenuBeanVO) => {
      emit('set-active-menu', {
        id: data.id,
        name: data.name,
        childrenCount: data.children ? data.children.length : 0,
      })
    }

    const treeCheckChange = (data: MenuBeanVO, checkNode: boolean) => {
      if (checkNode) {
        menuElTreeRef.value.setCheckedKeys([data.id])
        if (props.source === 0) {
          setActiveMenu(data)
        }
      }
    }

    const cleanActiveMenu = () => {
      menuElTreeRef.value.setCheckedKeys([])
      emit('set-active-menu', {
        id: '',
        name: '',
        children: [],
      })
    }

    return {
      Search,
      searchVal,
      menuElTreeRef,
      treeCheckChange,
      cleanActiveMenu,
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
.tree-bd{
  border-bottom: var(--border-1);;
}
</style>
<style lang="scss">
.menu-index-tree{
  & .el-tree-node__content{
    border-bottom: var(--border-1);
  }
  & .el-tree__empty-block{
    border-bottom: var(--border-1);
  }
}
</style>