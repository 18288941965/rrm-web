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
        title="菜单元素"
        :type="form.id ? '编辑' : '新增'"
      />
    </template>

    <el-form
      ref="menuElementEditFrom"
      class="rrm-form"
      :model="form"
      :rules="rules"
      label-width="90px"
    >
      <el-form-item
        label="元素名称"
        prop="name"
      >
        <el-input
          v-model.trim="form.name"
          clearable
        />
      </el-form-item>

      <el-form-item
        label="元素类型"
        prop="type"
      >
        <ev-select
          v-model="form.type"
          dict-type="dic_menu_element_type"
          :default-attr="{ label: 'entryName', value: 'entryCode' }"
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            @click="onSubmit(menuElementEditFrom)"
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
import {MenuElementBean} from './menuModel'
import EvSelect from '../../../components/evcomp/ev-select.vue'
import DialogHeader from '../../../components/dialog-header.vue'
import DialogFooter from '../../../components/dialog-footer.vue'
import {
  createMenuElement,
  getMenuElementById,
  updateMenuElement,
} from './menuOption'
import {assignExistingFields} from '@utils/utils'

export default defineComponent({
  name: 'MenuElemnetEditDialog',
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
          menuId: '',
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
  setup: function (props, {emit}) {
    const {
      visible,
      isRefresh,
    } = dialogOptions()
    const menuElementEditFrom = ref<FormInstance>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<MenuElementBean>({
      id: '',
      name: '',
      menuId: '',
      type: '',
    })

    const rules = reactive<FormRules<MenuElementBean>>({
      name: [{required: true, message: '请输入菜单名称', trigger: 'change'}],
      type: [{required: true, message: '请选择菜单类型', trigger: 'change'}],
    })

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      form.id = ''
      formEl.resetFields()
    }

    // 关闭窗口
    const handleClose = () => {
      resetForm(menuElementEditFrom.value)
      const refresh = isRefresh.value
      isRefresh.value = false
      emit('close-dialog', refresh)
    }

    const handleCallback = (res: AxiosResult) => {
      if (res.code == 200) {
        ElMessage.success(res.message)
        form.id = res.data
        isRefresh.value = true
        handleClose()
      }
    }

    const onSubmit = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {

          if (props.params.dataId) {
            updateMenuElement(form).then(res => {
              handleCallback(res)
            })
          } else {
            createMenuElement(form).then(res => {
              handleCallback(res)
            })
          }
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    const handleOpen = () => {
      form.menuId = props.params.menuId

      if (props.params.dataId) {
        getMenuElementById(props.params.dataId).then(res => {
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
      menuElementEditFrom,
      handleOpen,
      handleClose,
      onSubmit,
      resetForm,
    }
  },
})

</script>


<style scoped lang="scss">
  .form-item-grid{
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>