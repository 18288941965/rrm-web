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
        :title="params.parentId ? '子机构' : '一级机构'"
        :type="form.id ? '编辑' : '新增'"
        :name="params.parentName"
      />
    </template>
    <el-form
      ref="orgEditFormRef"
      class="rrm-form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="机构代码"
        prop="code"
      >
        <el-input
          v-model.trim="form.code"
          clearable
          :disabled="form.id !== ''"
          placeholder="机构代码在创建后就不可再编辑"
        />
      </el-form-item>
      
      <el-form-item
        label="机构名称"
        prop="name"
      >
        <el-input
          v-model.trim="form.name"
          clearable
        />
      </el-form-item>

      <el-form-item
        label="机构简称"
        prop="abbrName"
      >
        <el-input
          v-model.trim="form.abbrName"
          clearable
        />
      </el-form-item>

      <el-form-item
        label="机构类型"
        prop="type"
      >
        <ev-select
          v-model="form.type"
          dict-type="dic_org_type"
          :default-attr="{ label: 'entryName', value: 'entryCode' }"
          clearable
        />
      </el-form-item>

      <el-form-item
        label="机构状态"
        prop="status"
      >
        <ev-select
          v-model="form.status"
          dict-type="dic_org_status"
          :default-attr="{ label: 'entryName', value: 'entryCode' }"
          disabled
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            @click="onSubmit(orgEditFormRef)"
          >
            提交
          </el-button>
        </template>
      </dialog-footer>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, ref, watch} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus/es'
import {AxiosResult, PropPrams} from '@utils/interface'
import {dialogOptions} from '@utils/dialogOptions'
import DialogHeader from '../../../components/dialog-header.vue'
import DialogFooter from '../../../components/dialog-footer.vue'
import {OrgBean} from './orgModel'
import {createOrg, getOrgById, updateOrg} from './orgOption'
import {assignExistingFields} from '@utils/utils'
import EvSelect from '../../../components/evcomp/ev-select.vue'

export default defineComponent({
  name: 'OrgEditDialog',
  components: {
    EvSelect,
    DialogHeader,
    DialogFooter,
  },
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          dataId: '',
          parentId: null,
          parentName: null,
        }
      },
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup(props, {emit}) {
    const {
      visible,
        isRefresh,
    } = dialogOptions()
    const orgEditFormRef = ref<FormInstance>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<OrgBean>({
      id: '',
      code: '',
      name: '',
      parentId: null,
      abbrName: null,
      type: null,
      status: '01',
    })

    const rules = reactive<FormRules<OrgBean>>({
      name: [{ required: true, message: '机构名称为必填项', trigger: 'change'}],
      code: [{ required: true, message: '机构代码为必填项', trigger: 'change'}],
    })

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      Object.assign(form, {
        id: '',
        parentId: null,
      })
    }
    
    // 关闭窗口
    const handleClose = () => {
      resetForm(orgEditFormRef.value)
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
          if (props.params.dataId) {
            updateOrg(form).then(res => {handleCallback(res)})
          } else {
            createOrg(form).then(res => {handleCallback(res)})
          }
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    const handleOpen = () => {
      if (props.params.parentId) {
        form.parentId = props.params.parentId
      }
      if (props.params.dataId) {
        getOrgById(props.params.dataId).then(res => {
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
      orgEditFormRef,
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