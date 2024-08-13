<template>
  <el-dialog
    v-model="visible"
    title="字典类型编辑"
    width="720"
    :before-close="handleClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <el-form
      ref="dictTypeEditRef"
      class="rrm-form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="类型代码"
        prop="typeCode"
        :rules="form.id ? [] : [
          { required: true, message: '类型代码为必填项', trigger: 'change' },
        ]"
      >
        <el-input
          v-model.trim="form.typeCode"
          :disabled="dataId"
          placeholder="类型代码在创建后不可更改"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="类型名称"
        prop="typeName"
      >
        <el-input v-model.trim="form.typeName" />
      </el-form-item>
      <el-form-item
        label="类型描述"
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
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="onSubmit(dictTypeEditRef)"
        >提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, ref, watch, reactive} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus/es'
import {AxiosResult} from '@utils/interface'
import {dialogOptions} from '@utils/dialogOptions'
import {DictTypeBean} from './dictModel'
import {createDictType, getDictTypeById, updateDictType} from './dictOption'

export default defineComponent({
  name: 'DictTypeEditDialog',
  props: {
    dataId: {
      type: Number,
      default: 0,
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
    const dictTypeEditRef = ref<FormInstance>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<DictTypeBean>({
      id: 0,
      typeCode: '',
      typeName: '',
      description: '',
    })

    const rules = reactive<FormRules<DictTypeBean>>({
      typeName: [{ required: true, message: '类型名称为必填项', trigger: 'change'}],
    })

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      form.id = 0
      formEl.resetFields()
    }
    
    // 关闭窗口
    const handleClose = () => {
      resetForm(dictTypeEditRef.value)
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
            updateDictType(form).then(res => {handleCallback(res)})
          } else {
            createDictType(form).then(res => {handleCallback(res)})
          }
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    const handleOpen = () => {
      if (props.dataId) {
        getDictTypeById(props.dataId).then(res => {
          if (res.code === 200) {
            const data = res.data
            Object.assign(form, {
              id: data.id,
              typeCode: data.typeCode,
              typeName: data.typeName,
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
      dictTypeEditRef,
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