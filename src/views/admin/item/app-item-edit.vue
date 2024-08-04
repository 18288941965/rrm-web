<template>
  <el-dialog
    v-model="visible"
    title="项目编辑"
    width="720"
    :before-close="handleClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <el-form
      ref="appItemEditFrom"
      :model="form"
      :rules="rules"
      class="app-item-edit-form"
      label-width="auto"
    >
      <el-form-item
        label="项目代码"
        prop="itemCode"
      >
        <el-input
          v-model.trim.number="form.itemCode"
          clearable
          :disabled="form.id"
          placeholder="项目唯一标识，只能包含数字，创建后不可修改"
        />
      </el-form-item>
      <el-form-item
        label="项目名称"
        prop="itemName"
      >
        <el-input
          v-model.trim="form.itemName"
          clearable
          placeholder=""
        />
      </el-form-item>
      
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit(appItemEditFrom)"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, ref, watch, reactive} from 'vue'
import {ItemBean} from './itemModel'
import {createItem, getItemById, updateItem} from './itemOption'
import {ElMessage, FormInstance, FormRules} from 'element-plus/es'

export default defineComponent({
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
    const visible = ref(false)
    const refresh = ref(false)
    const appItemEditFrom = ref<FormInstance>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<ItemBean>({
      id: 0,
      itemName: '',
      itemCode: '',
    })

    const rules = reactive<FormRules<ItemBean>>({
      itemCode: [
        {
          required: true,
          message: '请输入项目代码',
          trigger: 'change',
        },
      ],
      itemName: [
        {
          required: true,
          message: '请输入项目名称',
          trigger: 'change',
        },
      ],
    })

    // 关闭窗口
    const handleClose = () => {
      Object.assign(form, {
        id: 0,
        itemName: '',
        itemCode: '',
      })
      const tmp = refresh.value
      refresh.value = false
      emit('close-dialog', tmp)
    }

    const onSubmit = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          if (form.id > 0) {
            updateItem(form).then(res => {
              if (res.code == 200) {
                ElMessage.success(res.message)
                refresh.value = true
                handleClose()
              }
            })
          } else {
            createItem(form).then(res => {
              if (res.code == 200) {
                ElMessage.success(res.message)
                refresh.value = true
                handleClose()
              }
            })
          }
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    const handleOpen = () => {
      if (props.dataId) {
        form.id = props.dataId
        getItemById(form.id).then(res => {
          if (res.code === 200)  {
            const data = res.data
            form.itemCode = data.itemCode
            form.itemName = data.itemName
          }
        })
      }
    }

    return {
      visible,
      rules,
      form,
      appItemEditFrom,
      handleOpen,
      handleClose,
      onSubmit,
    }
  },
})

</script>


<style scoped lang="scss">
  .app-item-edit-form{
    margin: var(--mg-large);
  }
</style>