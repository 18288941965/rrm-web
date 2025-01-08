<template>
  <el-dialog
    v-model="visible"
    top="100px"
    width="720"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <template #header>
      <dialog-header
        title="扫描资源"
      />
    </template>

    <div>
      <el-form
        ref="resourceScanFormRef"
        :model="form"
        :rules="rules"
        class="rrm-form"
        label-width="auto"
      >
        <el-form-item
          label="资源地址"
          prop="url"
        >
          <el-input
            v-model.trim.number="form.url"
            clearable
            type="textarea"
            :rows="2"
          />
        </el-form-item>
        <el-form-item
          label="扫描微服务"
          prop="serviceName"
        >
          <ev-select
            v-model="form.serviceName"
            dict-type="dic_service_name"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
          />
        </el-form-item>
        <el-form-item
          label="请求方式"
          prop="axiosType"
        >
          <el-input
            v-model.trim="form.axiosType"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item
          label="token验证"
          prop="token"
        >
          <el-input
            v-model.trim="form.token"
            clearable
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item
          label="apiKey验证"
          prop="apiKey"
        >
          <el-input
            v-model.trim="form.apiKey"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            @click="runScannerRrmResource(resourceScanFormRef)"
          >
            执行
          </el-button>
        </template>
      </dialog-footer>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from 'vue'
import {dialogOptions} from '@utils/dialogOptions'
import DialogHeader from '../../../components/dialog-header.vue'
import {ElMessage} from 'element-plus/es'
import EvSelect from '../../../components/evcomp/ev-select.vue'
import {FormInstance, FormRules} from 'element-plus'
import {ResourceScanBean} from './resourceModel'
import DialogFooter from '../../../components/dialog-footer.vue'
import LocalStorage from '../../../class/LocalStorage'
import axios from 'axios'
import {AxiosResult} from '@utils/interface'

export default defineComponent({
  name: 'ResourceScanDialog',
  components: {
    DialogFooter,
    EvSelect,
    DialogHeader,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup(props, { emit }) {
    const {
      visible,
      isRefresh,
    } = dialogOptions()

    const resourceScanFormRef = ref<FormInstance>()
    const form = reactive<ResourceScanBean>({
      url: '',
      token: '',
      serviceName: '',
      axiosType: 'post',
      apiKey: '',
      createdBy: -1,
      itemCode: '',
    })

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    // 关闭窗口, 清空相关数据
    const handleClose = () => {
      Object.assign(form, {
        url: '',
        token: '',
        serviceName: '',
        axiosType: 'post',
        apiKey: '',
        createdBy: -1,
        itemCode: '',
      })
      const refresh = isRefresh.value
      isRefresh.value = false
      emit('close-dialog', true, refresh)
    }

    // 扫描资源
    const scannerRrmResource = () => {
      axios.create().post(form.url, form ).then((res: { data: AxiosResult }) => {
        if (res.data.code === 200) {
          isRefresh.value = true
          ElMessage.success('扫描成功')
          handleClose()
        } else {
          ElMessage.error(res.data.message)
        }
      }).catch((error: Error) => {
        ElMessage.error(error.message)
      })
    }

    const runScannerRrmResource = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          scannerRrmResource()
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    const rules = reactive<FormRules<ResourceScanBean>>({
      url: [{required: true, message: '请输入请求地址', trigger: 'change'}],
      serviceName: [{required: true, message: '请选择微服务', trigger: 'change'}],
    })

    const handleOpen = () => {
      const local = new LocalStorage()
      const userInfoObj = local.getUserInfoObj()
      form.itemCode = userInfoObj.itemCode
      form.createdBy = userInfoObj.id
    }

    return {
      visible,
      handleOpen,
      handleClose,
      runScannerRrmResource,

      rules,
      form,
      resourceScanFormRef,
    }
  },
})
</script>

<style scoped lang="scss">

</style>