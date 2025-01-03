<template>
  <div class="rrm-tree-body">
    <el-input
      v-model.trim="searchVal"
      class="mgb-medium"
      clearable
      placeholder="角色过滤"
      style="max-width: 600px"
    >
    </el-input>

    <el-tree
      ref="roleTreeRef"
      class="rrm-tree"
      :class="{'tree-bd': roleTreeList && roleTreeList.length < 1}"
      :data="getRoleTreeList"
      :props="{label: 'name', children: 'children', disabled: 'disabled'}"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :check-on-click-node="true"
      :check-strictly="true"
      :filter-node-method="filterNode"
      @node-click="setActiveRole"
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
              type="info"
              round
              size="small"
            >
              {{ data.terminalName }}
            </el-tag>
            <el-tag
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
import {computed, defineComponent, ref, toRef, watch} from 'vue'
import {RoleBeanVO} from './roleModel'

export default defineComponent({
  name: 'RoleTree',
  props: {
    roleList: {
      type: Array<RoleBeanVO>,
      default: [],
    },
  },
  emits: ['set-active-node'],
  setup(props, { emit }) {
    const roleTreeList = toRef(props, 'roleList')

    const roleTreeRef = ref()
    const searchVal = ref('')
    const treeActiveId = ref('')

    const setActiveRole = (data: RoleBeanVO) => {
      // 深拷贝去掉 children
      const childrenCount = data.children ? data.children.length : 0
      const nodeCopy: RoleBeanVO = { ...data, children: [], childrenCount }
      emit('set-active-node', nodeCopy)
      treeActiveId.value = data.id
    }

    const cleanTreeActiveId = () => {
      treeActiveId.value = ''
    }

    const getRoleTreeList = computed(() => {
      return roleTreeList.value
    })

    const filterNode = (value: string, data: RoleBeanVO) => {
      if (!value) return true
      return data.name.includes(value)
    }

    watch(searchVal, (val) => {
      roleTreeRef.value!.filter(val)
    })

    return {
      roleTreeList,
      getRoleTreeList,
      searchVal,
      roleTreeRef,
      setActiveRole,
      cleanTreeActiveId,
      filterNode,
      treeActiveId,
    }
  },
})
</script>


<style scoped lang="scss">
  @use "../../../assets/scssscoped/tree/rrm-tree";
</style>
<style lang="scss">
  @use "../../../assets/scss/tree/rrm-tree";

  .rrm-tree .el-tree-node__content {
    border-bottom: var(--border-1);
  }

  .tree-move-check > .el-tree-node__content:nth-of-type(1) {
    color: var(--color-red);
  }
</style>