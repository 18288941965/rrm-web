<template>
  <el-drawer
    v-model="visible"
    title="角色选择"
    direction="rtl"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :size="560"
    @open="handleOpen"
  >
    <el-tree
      ref="roleSelectMoreElTreeRef"
      class="rrm-tree"
      :class="{'tree-bd': roleList && roleList.length < 1}"
      :data="roleList"
      :props="{label: 'name', children: 'children', disabled: 'disabled'}"
      node-key="id"
      show-checkbox
      default-expand-all
      :default-checked-keys="roleChecked"
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
                v-if="node.level <= 1"
                type="info"
                round
                size="small"
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
import {RoleBean, RoleBeanVO} from './roleModel'
import {searchRoleTree} from './roleOption'
import {PropPrams} from '@utils/interface'
import {bindUsersRole, getUsersBindRole} from "../users/usersOption";
import {UsersRoleBean} from "../users/usersModel";
import {ElMessage} from "element-plus/es";

export default defineComponent({
  name: 'RoleSelectMoreDrawer',
  components: {
    DialogFooter,
  },
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          usersId: '',
          orgId: '',
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
    const roleList = ref<Array<RoleBeanVO>>([])
    const roleChecked = ref<Array<string>>([])
    
    const {
      visible,
      loading,
    } = dialogOptions()
    const roleSelectMoreElTreeRef = ref()
    
    watch(
      () => props.show,
      () => {
        visible.value = props.show
      },
    )

    const filterNode = (value: string, data: RoleBeanVO) => {
      if (!value) return true
      return data.name.includes(value)
    }
    const searchVal = ref('')
    watch(searchVal, (val) => {
      roleSelectMoreElTreeRef.value!.filter(val)
    })

    const handleOpen = () => {
      getUsersBindRole(props.params.usersId, props.params.orgId).then(res => {
        if (res.code === 200) {
          roleChecked.value = res.data.map((item: RoleBean) => item.id)

          searchRoleTree().then(res => {
            if (res.code === 200) {
              roleList.value = res.data
              if (props.params.code) {
                roleSelectMoreElTreeRef.value?.setTreeCheckedKeys(props.params.code)
              }
            }
          })
        }
      })
    }

    // 关闭窗口
    const handleClose = (event: Event | null, roleCount: number) => {
      roleList.value = []
      loading.value = false
      emit('close-dialog', event === null, roleCount, props.params.usersId, props.params.orgId)
    }

    const submit = () => {
      const checkedNodesKeys: Array<string> = roleSelectMoreElTreeRef.value?.getCheckedKeys()
      const obj: UsersRoleBean = {
        usersId: props.params.usersId,
        roleIdList: checkedNodesKeys,
        orgId: props.params.orgId,
      }
      bindUsersRole(obj).then(res => {
        if (res.code === 200) {
          ElMessage.success(res.message)
          handleClose(null, checkedNodesKeys.length)
        }
      })
    }

    return {
      visible,
      loading,
      roleChecked,
      roleList,
      submit,
      roleSelectMoreElTreeRef,
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
.rrm-tree .el-tree-node__content {
    border-bottom: var(--border-1);
}
</style>