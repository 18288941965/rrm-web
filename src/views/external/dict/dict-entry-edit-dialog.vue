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
        title="字典项"
        :type="form.id ? '编辑' : '新增'"
        :name="params.typeName"
      />
    </template>
    <el-form
      ref="dictItemEditRef"
      class="rrm-form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="字典代码"
        prop="entryCode"
        :rules="form.id ? [] : [
          { required: true, message: '字典代码为必填项', trigger: 'change' },
        ]"
      >
        <el-input
          v-model.trim="form.entryCode"
          :disabled="form.id > 0"
          placeholder="字典代码在创建后不可更改"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="字典名称"
        prop="entryName"
      >
        <el-input
          v-model.trim="form.entryName"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="字典状态"
        prop="status"
      >
        <el-radio-group v-model="form.status">
          <el-radio
            border
            label="启用"
            :value="1"
          />
          <el-radio
            border
            label="停用"
            :value="0"
          />
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="字典描述"
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
            @click="onSubmit(dictItemEditRef)"
          >
            提交
          </el-button>
        </template>
      </dialog-footer>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, ref, watch, reactive, PropType} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus/es'
import {AxiosResult, PropPrams} from '@utils/interface'
import {dialogOptions} from '@utils/dialogOptions'
import {DictEntryBean} from './dictModel'
import {
  createDictEntry,
  getDictEntryById,
  updateDictEntry,
} from './dictOption'
import DialogHeader from '../../../components/dialog-header.vue'
import DialogFooter from '../../../components/dialog-footer.vue'

export default defineComponent({
  name: 'DictItemEditDialog',
  components: {
    DialogHeader,
    DialogFooter,
  },
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          dataId: 0,
          typeCode: '',
          typeName: '',
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
  setup(props, {emit}) {
    const {
      visible,
        isRefresh,
    } = dialogOptions()
    const dictItemEditRef = ref<FormInstance>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<DictEntryBean>({
      entryCode: '',
      entryName: '',

      id: 0,
      typeCode: '',
      parentId: 0,
      sortOrder: 0,
      status: 1,
      description: '',
    })

    const rules = reactive<FormRules<DictEntryBean>>({
      entryName: [{ required: true, message: '字典名称为必填项', trigger: 'change'}],
    })

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      Object.assign(form, {
        id: 0,
        typeCode: '',
        sortOrder: 0,
      })
      formEl.resetFields()
    }
    
    // 关闭窗口
    const handleClose = (evt: Event | undefined, add = false) => {
      resetForm(dictItemEditRef.value)
      const refresh = isRefresh.value
      isRefresh.value = false
      emit('close-dialog', refresh, add)
    }

    const handleCallback = (res: AxiosResult, add = false) => {
      if (res.code == 200) {
        ElMessage.success(res.message)
        isRefresh.value = true
        handleClose(undefined, add)
      }
    }

    const onSubmit = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          if (props.params.dataId) {
            updateDictEntry(form).then(res => {handleCallback(res)})
          } else {
            createDictEntry(form).then(res => {handleCallback(res, true)})
          }
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    const handleOpen = () => {
      form.typeCode = props.params.typeCode
      if (props.params.dataId) {
        getDictEntryById(props.params.dataId).then(res => {
          if (res.code === 200) {
            const data = res.data
            Object.assign(form, {
              id: data.id,
              typeCode: data.typeCode,
              entryName: data.entryName,
              entryCode: data.entryCode,
              status: data.status,
              sortOrder: data.sortOrder,
              description: data.description,
            })
          }
        })
      }
    }

    return {
      visible,
      rules,
      form,
      dictItemEditRef,
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