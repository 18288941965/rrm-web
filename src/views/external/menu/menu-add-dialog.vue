<template>
  <el-dialog
    v-model="visible"
    title="菜单编辑"
    width="720"
    :before-close="handleClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <el-form
      ref="menuEditFrom"
      class="rrm-form"
      :model="form"
      label-width="90px"
    >
      <el-form-item
        label="父菜单"
        prop="parentName"
      >
        <span class="parent-name-span">{{ params.parentName }}</span>
      </el-form-item>
      
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
        label="菜单地址"
        prop="url"
      >
        <el-input
          v-model.trim="form.url"
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
            :min="0"
            :step="1"
            max="999"
          />
        </el-form-item>

        <el-form-item
          label="菜单可见性"
          prop="visibility"
        >
          <el-radio-group v-model="form.visibility">
            <el-radio
              label="是"
              value="1"
              border
            />
            <el-radio
              label="否"
              value="0"
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
          req-url="/admin/getDict2"
          :default-attr="{ label: 'mc', value: 'dm' }"
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
              value="1"
              border
            />
            <el-radio
              label="否"
              value="0"
              border
            />
          </el-radio-group>
        </el-form-item>
      </div>

      <div class="form-item-grid">
        <el-form-item
          label="跳转方式"
          prop="version"
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
      

      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit(menuEditFrom)"
        >
          提交
        </el-button>
        <el-button
          v-if="params.dataId"
          @click="resetForm"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, ref, watch, reactive, PropType} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus/es'
import {AxiosResult, PropPrams} from '@utils/interface'
import {dialogOptions} from '@utils/dialogOptions'
import {MenuBean} from './menuModel'
import EvSelect from '../../../components/evcomp/ev-select.vue'

export default defineComponent({
  name: 'MenuAddDialog',
  components: {EvSelect},
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          dataId: '',
          parentId: '',
          parentName: '',
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
    const menuEditFrom = ref<FormInstance>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<MenuBean>({
      id: '',
      parentId: '',
      name: '',
      icon: '',
      sortOrder: 0,
      visibility: '1',
      url: '',
      type: '',
      target: '_self',
      pageName: '',
      pageCache: '0',
      version: '1.0',
      itemCode: '',
    })

    const rules = reactive<FormRules<MenuBean>>({
      name: [{ required: true, message: '请输入菜单名称', trigger: 'change'}],
      url: [{ required: true, message: '请输入菜单名称', trigger: 'change'}],
      version: [{ required: true, message: '请输入菜单名称', trigger: 'change'}],
    })

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      form.id = ''
      formEl.resetFields()
    }
    
    // 关闭窗口
    const handleClose = () => {
      resetForm(menuEditFrom.value)
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
          // createUser(form).then(res => {handleCallback(res)})
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    const handleOpen = () => {}

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
  .parent-name-span{
    display: block;
    height: var(--size-default);
    width: 100%;
    border: var(--border-1);
    border-radius: var(--border-radius-medium);
    background-color: var(--el-disabled-bg-color);
  }
  .form-item-grid{
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>