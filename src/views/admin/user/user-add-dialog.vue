<template>
  <el-dialog
    v-model="visible"
    title="用户新增"
    width="720"
    :before-close="handleClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <el-form
      ref="userAddFrom"
      :model="form"
      :rules="rules"
      class="app-item-edit-form"
      label-width="auto"
    >
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input
          v-model.trim.number="form.username"
          clearable
          :disabled="form.id !== 0"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model.trim="form.password"
          clearable
          type="password"
          show-password
          placeholder=""
        />
      </el-form-item>

      <el-form-item
        label="用户说明"
        prop="comment"
      >
        <el-input
          v-model.trim="form.comment"
          clearable
          placeholder=""
        />
      </el-form-item>
      
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit(userAddFrom)"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, ref, watch, reactive} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus/es'
import {UserBean} from './userModel'
import {AxiosResult} from '@utils/interface'
import {createUser} from './userOption'
import {dialogOptions} from '@utils/dialogOptions'

export default defineComponent({
  name: 'UserAddDialog',
  props: {
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
    const userAddFrom = ref<FormInstance>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<UserBean>({
      id: 0,
      username: '',
      password: '',
      comment: '',
    })

    const validate = (rule: any, value: any, callback: any, message: string) => {
      const chineseCharPattern = /[\u4e00-\u9fa5]/
      if (chineseCharPattern.test(value)) {
        callback(new Error(`${message}不能包含中文字符`))
      } else if (value.length < 5) {
        callback(new Error(`${message}长度必须大于等于5位`))
      } else {
        callback()
      }
    }

    // 用户名自定义验证规则
    const validateUsername = (rule: any, value: any, callback: any) => {
      validate(rule, value, callback, '用户名')
    }

    // 用户名自定义验证规则
    const validatePassword = (rule: any, value: any, callback: any) => {
      validate(rule, value, callback, '密码')
    }

    const rules = reactive<FormRules<UserBean>>({
      username: [{ validator: validateUsername, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
    })

    // 关闭窗口
    const handleClose = () => {
      Object.assign(form, {
        id: 0,
        username: '',
        password: '',
        comment: '',
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
          createUser(form).then(res => {handleCallback(res)})
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
      userAddFrom,
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