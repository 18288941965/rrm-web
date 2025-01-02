<template>
  <el-dialog
    v-model="visible"
    width="720"
    top="100px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <template #header>
      <dialog-header
        title="用户"
        :type="form.id ? '编辑' : '新增'"
      />
    </template>
    <el-form
      ref="usersEditRef"
      class="rrm-form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="姓名"
        prop="name"
      >
        <el-input
          v-model.trim="form.name"
          clearable
        />
      </el-form-item>

      <div class="form-item-grid">
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model.trim="form.username"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model.trim="form.password"
            type="password"
            show-password
            :disabled="form.id !== ''"
          />
        </el-form-item>
      </div>

      <div class="form-item-grid">
        <el-form-item
          label="身份证号"
          prop="idNumber"
        >
          <el-input
            v-model.trim="form.idNumber"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="手机号码"
          prop="phoneNumber"
        >
          <el-input
            v-model.trim="form.phoneNumber"
            clearable
          />
        </el-form-item>
      </div>
      
      <div class="form-item-grid">
        <el-form-item
          label="性别"
          prop="gender"
        >
          <ev-select
            v-model="form.gender"
            dict-type="dic_user_gender"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="民族"
          prop="nation"
        >
          <ev-select
            v-model="form.nation"
            dict-type="dic_user_nation"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
          />
        </el-form-item>
      </div>
      
      <div class="form-item-grid">
        <el-form-item
          label="出生日期"
          prop="dateOfBirth"
        >
          <el-date-picker
            v-model="form.dateOfBirth"
            type="date"
            placeholder="Pick a day"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item
          label="用户类型"
          prop="type"
        >
          <ev-select
            v-model="form.type"
            dict-type="dic_user_type"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
          />
        </el-form-item>
      </div>

      <el-form-item
        label="用户描述"
        prop="description"
      >
        <el-input
          v-model.trim="form.description"
          type="textarea"
          :rows="2"
        />
      </el-form-item>

      <el-form-item
        label="账号状态"
        prop="status"
      >
        <ev-select
          v-model="form.status"
          dict-type="dic_account_status"
          :default-attr="{ label: 'entryName', value: 'entryCode' }"
          clearable
          disabled
        />
      </el-form-item>

      <el-form-item
        label="所属机构"
      >
        <div class="checked-org-body">
          <ul
            v-if="form.orgList.length > 0"
            class="checked-org"
          >
            <li
              v-for="(org, index) in form.orgList"
              :key="'checked-org-' + index"
            >
              <span>{{ org.name }}</span>
              <span>{{ org.code }}</span>
            </li>
          </ul>
          <el-empty
            v-else
            description="未关联机构，请选择"
            style="padding: 10px 0;width: 100%;"
            :image-size="40"
          />
          <el-button
            :icon="Select"
            @click="dialogParamsOpen({ orgChecked: form.orgList.map(item => item.id) })"
          />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            @click="onSubmit(usersEditRef)"
          >
            提交
          </el-button>
        </template>
      </dialog-footer>
    </template>
    
    <org-select-more-drawer
      v-bind="dialogParam"
      @close-dialog="dialogParamsClose"
    />
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus/es'
import {AxiosResult} from '@utils/interface'
import {dialogOptions, dialogParamsContent} from '@utils/dialogOptions'
import DialogHeader from '../../../components/dialog-header.vue'
import DialogFooter from '../../../components/dialog-footer.vue'
import {UsersBean} from './usersModel'
import {createUsers, getUsersById, updateUsers} from './usersOption'
import {assignExistingFields} from '@utils/utils'
import {Select} from '@element-plus/icons-vue'
import EvSelect from '../../../components/evcomp/ev-select.vue'
import OrgSelectMoreDrawer from '../org/org-select-more-drawer.vue'
import {OrgCheck} from '../org/orgModel'

export default defineComponent({
  name: 'UsersEditDialog',
  components: {
    EvSelect,
    DialogHeader,
    DialogFooter,
    OrgSelectMoreDrawer,
  },
  props: {
    dataId: {
      type: String,
      default: '',
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
    const usersEditRef = ref<FormInstance>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<UsersBean>({
      id: '',
      name: '',
      username: '',
      password: '',
      gender: null,
      nation: null,
      idNumber: '',
      dateOfBirth: null,
      phoneNumber: '',
      avatar: null,
      type: null,
      description: null,
      status: '01',
      orgList: [],
    })

    const rules = reactive<FormRules<UsersBean>>({
      name: [{ required: true, message: '用户名称为必填项', trigger: 'change'}],
      gender: [{ required: true, message: '性别必填项', trigger: 'change'}],
      username: [{ required: true, message: '用户名为必填项', trigger: 'change'}],
      password: [{ required: true, message: '密码为必填项', trigger: 'change'}],
      idNumber: [{ required: true, message: '身份证号为必填项', trigger: 'change'}],
      phoneNumber: [{ required: true, message: '电话号码为必填项', trigger: 'change'}],
    })

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      Object.assign(form, {
        id: '',
        orgList: [],
      })
    }
    
    // 关闭窗口
    const handleClose = () => {
      resetForm(usersEditRef.value)
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

    const validOther = () => {
      form.idNumber = form.idNumber.toUpperCase()
      const valid = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(form.idNumber)
      if (!valid) {
        ElMessage.error('无效的身份证号！')
        return
      }

      const valid2 = /^1[3-9]\d{9}$/.test(form.phoneNumber)
      if (!valid2) {
        ElMessage.error('无效的手机号码！')
        return
      }

      if (!props.dataId && form.password.length < 6) {
        ElMessage.error('密码长度最少为 6 位！')
        return
      }

      if (props.dataId) {
        updateUsers(form).then(res => {handleCallback(res)})
      } else {
        createUsers(form).then(res => {handleCallback(res)})
      }
    }

    const onSubmit = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          validOther()
        } else {
          ElMessage.error('请填写完整表单！')
        }
      })
    }

    const handleOpen = () => {
      if (props.dataId) {
        getUsersById(props.dataId).then(res => {
          if (res.code === 200) {
            assignExistingFields(form, res.data)
          }
        })
      }
    }

    const {
      dialogParam,
      dialogParamsOpen,
      dialogParamsClose: dialogParamsCloses,
    } = dialogParamsContent()

    const dialogParamsClose = (refresh: boolean, result: Array<OrgCheck>) => {
      dialogParamsCloses()
      if (refresh) {
        form.orgList = result
      }
    }

    return {
      Select,
      visible,
      rules,
      form,
      usersEditRef,
      handleOpen,
      handleClose,
      onSubmit,
      resetForm,

      dialogParam,
      dialogParamsOpen,
      dialogParamsClose,
    }
  },
})

</script>

<style scoped lang="scss">
  .checked-org-body{
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 50px;
    grid-gap: 10px;
  }
  .checked-org{
    & li{
      display: flex;
      justify-content: space-between;
      border-radius: var(--border-radius-small);
      padding:  0 var(--pd-ultra-small);
      margin: var(--mg-small) 0;
      background-color: #EDF2FA;
    }
  }
  .form-item-grid{
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>