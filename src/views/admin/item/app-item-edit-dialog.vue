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
        title="项目"
        :type="form.id ? '编辑' : '新增'"
      />
    </template>
    
    <el-form
      ref="appItemEditFrom"
      :model="form"
      :rules="rules"
      class="rrm-form"
      label-width="auto"
    >
      <el-form-item
        label="项目代码"
        prop="itemCode"
        :rules="form.id ? [] : [
          { required: true, message: '项目代码为必填项', trigger: 'blur' },
          { pattern: /^[0-9]{6}$/, message: '项目代码必须为6位数字', trigger: 'blur' }
        ]"
      >
        <el-input
          v-model.trim.number="form.itemCode"
          clearable
          :disabled="form.id > 0"
          placeholder="请输入6位编码，只能包含数字，创建后不可修改"
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
    </el-form>

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            @click="onSubmit(appItemEditFrom)"
          >
            确定
          </el-button>
        </template>
      </dialog-footer>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from 'vue'
import {ItemBean} from './itemModel'
import {createItem, getItemById, updateItem} from './itemOption'
import {ElMessage, FormInstance, FormRules} from 'element-plus/es'
import {AxiosResult} from '@utils/interface'
import {dialogOptions} from '@utils/dialogOptions'
import DialogHeader from '../../../components/dialog-header.vue'
import DialogFooter from '../../../components/dialog-footer.vue'

export default defineComponent({
  name: 'AppItemEditDialog',
  components: {DialogFooter, DialogHeader},
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
          if (form.id > 0) {
            updateItem(form).then(res => {handleCallback(res)})
          } else {
            createItem(form).then(res => {handleCallback(res)})
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
</style>