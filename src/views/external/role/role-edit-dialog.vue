<template>
  <el-dialog
    v-model="visible"
    width="720"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <template #header>
      <dialog-header
        title="角色"
        :type="form.id ? '编辑' : '新增'"
      />
    </template>
    <el-form
      ref="roleEditRef"
      class="rrm-form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="角色名称"
        prop="name"
      >
        <el-input
          v-model.trim="form.name"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="角色类型"
        prop="type"
      >
        <ev-select
          v-model="form.type"
          dict-type="dic_role_type"
          :default-attr="{ label: 'entryName', value: 'entryCode' }"
          clearable
        />
      </el-form-item>

      <el-form-item
        label="所属终端"
        prop="terminal"
      >
        <ev-select
          v-model="form.terminal"
          dict-type="dic_terminal"
          :default-attr="{ label: 'entryName', value: 'entryCode' }"
          clearable
        />
      </el-form-item>

      <el-form-item
        label="网络类型"
        prop="netType"
      >
        <ev-select
          v-model="form.netType"
          dict-type="dic_net_type"
          :default-attr="{ label: 'entryName', value: 'entryCode' }"
          clearable
        />
      </el-form-item>

      <el-form-item
        label="角色描述"
        prop="description"
      >
        <el-input
          v-model.trim="form.description"
          type="textarea"
          :rows="2"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            @click="onSubmit(roleEditRef)"
          >
            提交
          </el-button>
        </template>
      </dialog-footer>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus/es'
import {AxiosResult} from '@utils/interface'
import {dialogOptions} from '@utils/dialogOptions'
import DialogHeader from '../../../components/dialog-header.vue'
import DialogFooter from '../../../components/dialog-footer.vue'
import {RoleBean} from './roleModel'
import {createRole, getRoleById, updateRole} from './roleOption'
import {assignExistingFields} from '@utils/utils'
import EvSelect from '../../../components/evcomp/ev-select.vue'

export default defineComponent({
  name: 'RoleEditDialog',
  components: {
    EvSelect,
    DialogHeader,
    DialogFooter,
  },
  props: {
    dataId: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup(props, {emit}) {
    const {
      visible,
        isRefresh,
    } = dialogOptions()
    const roleEditRef = ref<FormInstance>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<RoleBean>({
      id: '',
      name: '',
      status: 1,
      type: '',
      sortOrder: 0,
      description: '',
      terminal: '',
      netType: '',
    })

    const rules = reactive<FormRules<RoleBean>>({
      name: [{ required: true, message: '角色名称为必填项', trigger: 'change'}],
    })

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      Object.assign(form, {
        id: '',
        status: 1,
      })
      formEl.resetFields()
    }
    
    // 关闭窗口
    const handleClose = () => {
      resetForm(roleEditRef.value)
      const refresh = isRefresh.value
      isRefresh.value = false
      emit('close-dialog', refresh)
    }

    const handleCallback = (res: AxiosResult) => {
      if (res.code == 200) {
        ElMessage.success(res.message)
        isRefresh.value = true
        handleClose()
      }
    }

    const onSubmit = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          if (props.dataId) {
            updateRole(form).then(res => {handleCallback(res)})
          } else {
            createRole(form).then(res => {handleCallback(res)})
          }
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    const handleOpen = () => {
      if (props.dataId) {
        getRoleById(props.dataId).then(res => {
          if (res.code === 200) {
            assignExistingFields(form, res.data)
          }
        })
      }
    }

    return {
      visible,
      rules,
      form,
      roleEditRef,
      handleOpen,
      handleClose,
      onSubmit,
      resetForm,
    }
  },
})

</script>


<style scoped lang="scss">
  
</style>