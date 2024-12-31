<template>
  <div class="org-tree">
    <el-input
      v-model.trim="searchVal"
      class="mgb-medium"
      clearable
      placeholder="机构过滤"
      style="max-width: 600px"
    >
      <template #append>
        <el-button
          :icon="Search"
          style="width: 120px"
        />
      </template>
    </el-input>

    <el-tree
      ref="orgElTreeRef"
      class="org-index-tree"
      :class="{'tree-bd': orgTreeList && orgTreeList.length < 1}"
      :data="getOrgTreeList"
      :props="{label: 'name', children: 'children', disabled: 'disabled'}"
      node-key="code"
      show-checkbox
      default-expand-all
      :expand-on-click-node="false"
      :check-on-click-node="true"
      :check-strictly="true"
      :filter-node-method="filterNode"
      @check-change="treeCheckChange"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
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
import {computed, defineComponent, nextTick, reactive, ref, toRef, watch} from 'vue'
import {OrgBeanVO} from './orgModel'
import {Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'OrgTree2',
  props: {
    orgList: {
      type: Array<OrgBeanVO>,
      default: [],
    },
    source: {
      type: Number,
      default: 0,
    },
    disabledIds: {
      type: Array<string>,
      default: [],
    },
  },
  emits: ['set-active-org', 'set-checked-keys'],
  setup(props, { emit }) {
    const orgTreeList = toRef(props, 'orgList')

    const orgElTreeRef = ref()
    const searchVal = ref('')
    const clickActiveId = ref('')

    const setActiveOrg = (data: OrgBeanVO) => {
      // 深拷贝去掉 children
      const childrenCount = data.children ? data.children.length : 0
      const nodeCopy: OrgBeanVO = { ...data, children: [], childrenCount }
      emit('set-active-org', nodeCopy)
      clickActiveId.value = data.id
    }

    const cleanCheck = () => {
      emit('set-active-org', {
        id: '',
        name: '',
        code: '',
        childrenCount: 0,
      })
    }

    const checkVal = reactive<{
      newVal: string
      oldVal: string
    }>({
      newVal: '',
      oldVal: '',
    })
    const treeCheckChange = (data: OrgBeanVO, checkNode: boolean) => {
      // 第一次选中
      if (checkNode && !checkVal.oldVal) {
        setActiveOrg(data)
        checkVal.oldVal = data.id
        checkVal.newVal = data.id
        return
      }
      // 除第一次外选中
      if (checkNode) {
        setActiveOrg(data)
        checkVal.oldVal = checkVal.newVal
        checkVal.newVal = data.id
        orgElTreeRef.value.setCheckedKeys([data.code])
        return
      }

      // 取消第一个选中的节点
      if (checkVal.oldVal === checkVal.newVal) {
        cleanCheck()
        checkVal.newVal = ''
        checkVal.oldVal = ''
      }

      // 取消新选中的值
      if (checkVal.newVal === data.id) {
        cleanCheck()
        checkVal.newVal = ''
        checkVal.oldVal = ''
      }

      // 二次触发事件，不做任何处理
    }

    const cleanActiveOrg = (cleanActive = false) => {
      orgElTreeRef.value.setCheckedKeys([])
      orgTreeList.value = []
      if (cleanActive) {
        cleanCheck()
      }
    }

    // 数据回显
    const setTreeCheckedKeys = (code: string) => {
      nextTick(() => {
        orgElTreeRef.value.setCheckedKeys([code])
      })
    }

    const setDisabledOrg = (tree: Array<OrgBeanVO>) => {
      tree.forEach(org => {
        if (props.disabledIds.includes(org.id)) {
          org.disabled = true
        }
        if (org.children) {
          setDisabledOrg(org.children)
        }
      })
    }

    const setDisabledMenu = (tree: Array<OrgBeanVO>) => {
      tree.forEach(menu => {
        if (menu.status === 0) {
          menu.disabled = true
        }
        if (menu.children) {
          setDisabledMenu(menu.children)
        }
      })
    }

    const getOrgTreeList = computed(() => {
      setDisabledMenu(orgTreeList.value)
      return orgTreeList.value
    })

    const filterNode = (value: string, data: OrgBeanVO) => {
      if (!value) return true
      return data.name.includes(value)
    }

    watch(searchVal, (val) => {
      orgElTreeRef.value!.filter(val)
    })

    return {
      Search,
      orgTreeList,
      getOrgTreeList,
      searchVal,
      orgElTreeRef,
      treeCheckChange,
      cleanActiveOrg,
      setTreeCheckedKeys,
      filterNode,
    }
  },
})
</script>


<style scoped lang="scss">
.org-tree{
  flex: 1;
  margin-right: var(--mg-medium);
}

.org-index-tree{
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
.org-index-tree{
  max-width: 1000px;
  & .el-tree-node__content, .tree-bd, .el-tree__empty-block{
    border-bottom: var(--border-1);
  }
}

.tree-move-check > .el-tree-node__content:nth-of-type(1) {
  color: var(--color-red);
}

</style>