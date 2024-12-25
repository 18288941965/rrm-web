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
        :title="params.parentId ? '子菜单' : '一级菜单'"
        :type="form.id ? '编辑' : (params.parentId ? '添加' : '创建')"
        :name="params.parentName"
      />
    </template>

    <el-form
      ref="menuEditFrom"
      class="rrm-form"
      :model="form"
      :rules="rules"
      label-width="90px"
    >
      <el-form-item
        label="菜单名称"
        prop="name"
      >
        <el-input
          v-model.trim="form.name"
          clearable
        />
      </el-form-item>

      <el-form-item
        label="菜单图标"
        prop="icon"
      >
        <el-input
          v-model.trim="form.icon"
          clearable
        />
      </el-form-item>

      <el-form-item
        label="菜单路径"
        prop="path"
      >
        <el-input
          v-model.trim="form.path"
          type="textarea"
          :rows="2"
          clearable
        />
      </el-form-item>

      <div class="form-item-grid">
        <el-form-item
          label="菜单排序"
          prop="sortOrder"
        >
          <el-input-number
            v-model="form.sortOrder"
            :disabled="form.id != null && form.id != ''"
            :min="0"
            :step="1"
            :max="999"
          />
        </el-form-item>

        <el-form-item
          label="菜单可见性"
          prop="visibility"
        >
          <el-radio-group v-model="form.visibility">
            <el-radio
              label="是"
              :value="1"
              border
            />
            <el-radio
              label="否"
              :value="0"
              border
            />
          </el-radio-group>
        </el-form-item>
      </div>

      <el-form-item
        label="菜单类型"
        prop="type"
      >
        <ev-select
          v-model="form.type"
          dict-type="dic_menu_type"
          :default-attr="{ label: 'entryName', value: 'entryCode' }"
          clearable
        />
      </el-form-item>

      <div class="form-item-grid">
        <el-form-item
          label="页面名称"
          prop="pageName"
        >
          <el-input
            v-model.trim="form.pageName"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="页面缓存"
          prop="pageCache"
        >
          <el-radio-group v-model="form.pageCache">
            <el-radio
              label="是"
              :value="1"
              border
            />
            <el-radio
              label="否"
              :value="0"
              border
            />
          </el-radio-group>
        </el-form-item>
      </div>

      <div class="form-item-grid">
        <el-form-item
          label="跳转方式"
          prop="target"
        >
          <el-select v-model="form.target">
            <el-option
              label="_blank"
              value="_blank"
            />
            <el-option
              label="_self"
              value="_self"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="版本号"
          prop="version"
        >
          <el-input
            v-model.trim="form.version"
            clearable
          />
        </el-form-item>
      </div>

      <div class="form-item-grid">
        <el-form-item
          label="所属终端"
          prop="terminal"
        >
          <ev-select
            v-model="form.terminal"
            :disabled="params.parentId != ''"
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
            :disabled="params.parentId != ''"
            dict-type="dic_net_type"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            @click="onSubmit(menuEditFrom)"
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
import {MenuBean} from './menuModel'
import EvSelect from '../../../components/evcomp/ev-select.vue'
import DialogHeader from '../../../components/dialog-header.vue'
import DialogFooter from '../../../components/dialog-footer.vue'
import {createMenu, getMenuById, updateMenu} from './menuOption'
import {assignExistingFields} from '@utils/utils'

export default defineComponent({
  name: 'MenuAddDialog',
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
          parentId: '',
          parentName: '',
          terminal: '',
          netType: '',
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
    const menuEditFrom = ref<FormInstance>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<MenuBean>({
      id: '',
      parentId: null,
      name: '',
      icon: null,
      sortOrder: 0,
      visibility: 1,
      path: '',
      type: null,
      target: '_self',
      pageName: null,
      pageCache: 0,
      version: '1.0',
      terminal: '01',
      netType: '01',
    })

    const rules = reactive<FormRules<MenuBean>>({
      name: [{required: true, message: '请输入菜单名称', trigger: 'change'}],
      path: [{required: true, message: '请输入菜单路径', trigger: 'change'}],
      type: [{required: true, message: '请选择菜单类型', trigger: 'change'}],
      version: [{required: true, message: '请输入菜单版本', trigger: 'change'}],
      terminal: [{ required: true, message: '所属终端为必填项', trigger: 'change'}],
      netType: [{ required: true, message: '网络类型为必填项', trigger: 'change'}],
    })

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      form.id = ''
      formEl.resetFields()
    }

    // 关闭窗口
    const handleClose = () => {
      const editId = isRefresh.value ? form.id : ''
      resetForm(menuEditFrom.value)
      const refresh = isRefresh.value
      isRefresh.value = false
      emit('close-dialog', refresh, editId)
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
            updateMenu(form).then(res => {
              handleCallback(res)
            })
          } else {
            createMenu(form).then(res => {
              handleCallback(res)
            })
          }
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    const handleOpen = () => {
      if (props.params.parentId) {
        form.parentId = props.params.parentId
        form.terminal = props.params.terminal
        form.netType = props.params.netType
      }
      if (props.params.dataId) {
        getMenuById(props.params.dataId).then(res => {
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
      menuEditFrom,
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