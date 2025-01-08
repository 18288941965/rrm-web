<template>
  <el-drawer
    v-model="visible"
    title="机构选择（多选）"
    direction="rtl"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :size="560"
    @open="handleOpen"
  >
    <el-tree
      ref="orgSelectMoreElTreeRef"
      class="rrm-tree"
      :class="{'tree-bd': orgList && orgList.length < 1}"
      :data="orgList"
      :props="{label: 'name', children: 'children', disabled: 'disabled'}"
      node-key="id"
      show-checkbox
      default-expand-all
      :default-checked-keys="params.orgChecked"
      :expand-on-click-node="false"
      :check-on-click-node="true"
      :check-strictly="true"
      :filter-node-method="filterNode"
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

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            :loading="loading"
            @click="submit"
          >
            提交
          </el-button>
        </template>
      </dialog-footer>
    </template>
  </el-drawer>
</template>

<script lang="ts">
import {defineComponent, PropType, ref, watch} from 'vue'
import DialogFooter from '../../../components/dialog-footer.vue'
import {dialogOptions} from '@utils/dialogOptions'
import {OrgBeanVO, OrgCheck} from './orgModel'
import {getOrgByItemCode} from './orgOption'
import {PropPrams} from '@utils/interface'

export default defineComponent({
  name: 'OrgSelectMoreDrawer',
  components: {
    DialogFooter,
  },
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          orgChecked: Array<string>,
        }
      },
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup (props, {emit}) {
    const orgList = ref<Array<OrgBeanVO>>([])
    
    const {
      visible,
        loading,
    } = dialogOptions()
    const orgSelectMoreElTreeRef = ref()
    
    watch(
      () => props.show,
      () => {
        visible.value = props.show
      },
    )

    const filterNode = (value: string, data: OrgBeanVO) => {
      if (!value) return true
      return data.name.includes(value)
    }
    const searchVal = ref('')
    watch(searchVal, (val) => {
      orgSelectMoreElTreeRef.value!.filter(val)
    })

    const handleOpen = () => {
      getOrgByItemCode().then(res => {
        if (res.code === 200) {
          orgList.value = res.data
          if (props.params.code) {
            orgSelectMoreElTreeRef.value?.setTreeCheckedKeys(props.params.code)
          }
        }
      })
    }

    // 关闭窗口
    const handleClose = (_done: () => void, checkedOrgBeans: Array<OrgCheck>) => {
      orgList.value = []
      loading.value = false
      emit('close-dialog', _done.toString().startsWith('()'), checkedOrgBeans)
    }

    const submit = () => {
      const checkedNodes: Array<OrgBeanVO> = orgSelectMoreElTreeRef.value?.getCheckedNodes()
      const checkedOrgBeans: Array<OrgCheck> = checkedNodes.map(item => {
        return {
          id: item.id,
          name: item.name,
          code: item.code,
        }
      })
      handleClose(() => {}, checkedOrgBeans)
    }

    return {
      visible,
      loading,
      orgList,
      submit,
      orgSelectMoreElTreeRef,
      handleOpen,
      handleClose,

      searchVal,
      filterNode,
    }
  },
})
</script>

<style scoped lang="scss">
  @use "../../../assets/scssscoped/tree/rrm-tree";
</style>

<style lang="scss">
@use "../../../assets/scss/tree/rrm-tree";
</style>