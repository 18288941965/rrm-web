<template>
  <el-drawer
    v-model="visible"
    title="密码修改"
    direction="rtl"
    :before-close="handleClose"
    :size="400"
    @open="handleOpen"
  >
    <main class="user-pass-main">
      <el-form
        ref="userPassFrom"
        :model="form"
        :rules="rules"
        class="app-item-edit-form"
        label-width="auto"
      >
        <el-form-item
          label="原始密码"
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
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model.trim="form.newPassword"
            clearable
            type="password"
            show-password
            placeholder=""
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit(userPassFrom)"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </main>
  </el-drawer>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from 'vue'
import {UserPassBean} from './userModel'
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import {updatePass} from './userOption'
import {AxiosResult} from '@utils/interface'
import {doLogout, logoutContext} from '../../login/loginOptions'

export default defineComponent({
  name: 'UserPassDrawer',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup (props, {emit}) {
    const visible = ref(false)
    const userPassFrom = ref<FormInstance>()
    const form = reactive<UserPassBean>({
      password: '',
      newPassword: '',
    })

    watch(
      () => props.show,
      () => {
        visible.value = props.show
      },
    )
    
    const handleOpen = () => {
    }

    // 关闭窗口
    const handleClose = () => {
      Object.assign(form, {
        password: '',
        newPassword: '',
      })
      emit('close-dialog')
    }

    const validate = (_rule: any, value: any, callback: any) => {
      const chineseCharPattern = /[\u4e00-\u9fa5]/
      if (chineseCharPattern.test(value)) {
        callback(new Error('密码不能包含中文字符'))
      } else if (value.length < 5) {
        callback(new Error('密码长度必须大于等于5位'))
      } else {
        callback()
      }
    }

    const rules = reactive<FormRules<UserPassBean>>({
      password: [{ validator: validate, trigger: 'change' }],
      newPassword: [{ validator: validate, trigger: 'change' }],
    })

    const {
      logoutSuccess,
    } = logoutContext()

    const logout = () => {
      doLogout(logoutSuccess)
    }
    
    const handleCallback = (res: AxiosResult) => {
      if (res.code == 200) {
        ElMessage.success('修改密码成功！请重新登录')
        setTimeout(() => {
          logout()
        }, 500)
      }
    }
    
    const onSubmit = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          if (form.password === form.newPassword) {
            ElMessage.error('新密码不能和原始密码一样！')
            return
          }
          updatePass(form).then(res => {handleCallback(res)})
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    return {
      visible,

      handleOpen,
      handleClose,
      userPassFrom,
      rules,
      form,
      onSubmit,
    }
  },
})
</script>

<style scoped lang="scss">
  .user-pass-main{
    h5{
      padding: var(--pd-small);
      margin-bottom: var(--mg-medium);
      background-color: var(--bg-color-header);
      border: {
        bottom: 1px solid var(--border-color);
        top-left-radius: var(--border-radius-medium);
        top-right-radius: var(--border-radius-medium);
      }
    }
    & section{
      border: var(--border-1);
      border-radius: var(--border-radius-medium);
    }
    & .settings-container{
      padding: var(--pd-medium);
    }
  }
</style>