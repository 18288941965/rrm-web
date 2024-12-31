<template>
  <el-drawer
    v-model="visible"
    title="机构选择（单选）"
    direction="rtl"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :size="560"
    @open="handleOpen"
  >
    <org-tree
      ref="orgSelectOneTreeRef"
      :org-list="orgList"
      :source="1"
      @set-active-org="treeCheckChange"
    />

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="activeOrg.id === ''"
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
import {defineComponent, PropType, reactive, ref, watch} from 'vue'
import DialogFooter from '../../../components/dialog-footer.vue'
import {dialogOptions} from '@utils/dialogOptions'
import OrgTree from './org-tree.vue'
import {OrgBeanActive, OrgBeanBase, OrgBeanVO} from './orgModel'
import {getOrgByItemCode} from './orgOption'
import {PropPrams} from '@utils/interface'

export default defineComponent({
  name: 'OrgSelectOneDrawer',
  components: {
    OrgTree,
    DialogFooter,
  },
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          code: '',
          name: '',
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
    const orgSelectOneTreeRef = ref()
    
    watch(
      () => props.show,
      () => {
        visible.value = props.show
      },
    )

    // 右侧激活的菜单
    const activeOrg = reactive<OrgBeanActive>({
      id: '',
      name: '',
      code: '',
      childrenCount: 0,
    })
    const treeCheckChange = (data: OrgBeanActive) => {
      Object.assign(activeOrg, data)
    }

    const handleOpen = () => {
      getOrgByItemCode().then(res => {
        if (res.code === 200) {
          orgList.value = res.data
          if (props.params.code) {
            orgSelectOneTreeRef.value?.setTreeCheckedKeys(props.params.code)
          }
        }
      })
    }

    // 关闭窗口
    const handleClose = () => {
      const obj: OrgBeanBase = {
        name: activeOrg.name,
        code: activeOrg.code,
      }
      orgSelectOneTreeRef.value?.cleanTreeActiveId()
      orgList.value = []
      loading.value = false
      emit('close-dialog', obj)
    }

    const submit = () => {
      handleClose()
    }

    return {
      visible,
      loading,
      orgList,
      activeOrg,
      submit,
      orgSelectOneTreeRef,
      treeCheckChange,
      handleOpen,
      handleClose,
    }
  },
})
</script>

<style scoped lang="scss">
  
</style>