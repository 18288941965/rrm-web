<template>
  <div class="rrm-tree-body">
    <el-input
      v-model.trim="searchVal"
      class="mgb-medium"
      clearable
      placeholder="机构过滤"
    >
    </el-input>

    <el-tree
      ref="orgTreeRef"
      class="rrm-tree"
      :class="{'tree-bd': orgTreeList && orgTreeList.length < 1}"
      :data="getOrgTreeList"
      :props="{label: 'name', children: 'children', disabled: 'disabled'}"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :check-on-click-node="true"
      :check-strictly="true"
      :filter-node-method="filterNode"
      @node-click="setActiveOrg"
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
              v-if="data.type"
              type="info"
              round
              size="small"
            >
              {{ data.typeName }}
            </el-tag>
            <el-tag
              type="warning"
              round
              size="small"
              class="mgl-medium"
            >
              {{ data.statusName }}
            </el-tag>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, toRef, watch} from 'vue'
import {OrgBeanVO} from './orgModel'

export default defineComponent({
  name: 'OrgTree',
  props: {
    orgList: {
      type: Array<OrgBeanVO>,
      default: [],
    },
  },
  emits: ['set-active-node'],
  setup(props, { emit }) {
    const orgTreeList = toRef(props, 'orgList')

    const orgTreeRef = ref()
    const searchVal = ref('')
    const treeActiveId = ref('')

    const setActiveOrg = (data: OrgBeanVO) => {
      // 深拷贝去掉 children
      const childrenCount = data.children ? data.children.length : 0
      const nodeCopy: OrgBeanVO = { ...data, children: [], childrenCount }
      emit('set-active-node', nodeCopy)
      treeActiveId.value = data.id
    }

    const cleanTreeActiveId = () => {
      treeActiveId.value = ''
    }

    const getOrgTreeList = computed(() => {
      return orgTreeList.value
    })

    const filterNode = (value: string, data: OrgBeanVO) => {
      if (!value) return true
      return data.name.includes(value)
    }

    watch(searchVal, (val) => {
      orgTreeRef.value!.filter(val)
    })

    return {
      orgTreeList,
      getOrgTreeList,
      searchVal,
      orgTreeRef,
      setActiveOrg,
      cleanTreeActiveId,
      filterNode,
      treeActiveId,
    }
  },
})
</script>

<style scoped lang="scss">
  @use "../../../assets/scssscoped/rrm-tree";
</style>
<style lang="scss">
  @use "../../../assets/scss/rrm-tree";
</style>