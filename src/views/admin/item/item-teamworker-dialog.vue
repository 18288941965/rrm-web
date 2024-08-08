<template>
  <el-dialog
    v-model="visible"
    title="项目协作者编辑"
    width="720"
    :before-close="handleClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <main class="item-team-main">
      <el-checkbox-group
        v-model="selectUserId"
        @change="teamChange"
      >
        <el-checkbox
          v-for="(user, index) in userList"
          :key="'xzz-' + index"
          :label="user.comment ? user.username + '（' + user.comment + '）' : user.username"
          :value="user.id"
          :disabled="user.id === params.userId"
          border
        />
      </el-checkbox-group>
    </main>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType, ref, watch} from 'vue'
import {UserBean} from '../user/userModel'
import {getAllUserBase} from '../user/userOption'
import {createUserItem, deleteUserItem, getCorrelationUserId} from './itemOption'
import {AxiosResult, PropPrams} from '@utils/interface'
import {ElMessage} from 'element-plus'
import {dialogOptions} from '@utils/dialogOptions'

export default defineComponent({
  name: 'ItemTeamworkerDialog',
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          dataId: 0,
          userId: 0,
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
    
    const userList = ref<Array<UserBean>>([])
    const selectUserId = ref<Array<number>>([])
    const selectUserIdBak = ref<Array<number>>([])

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    // 关闭窗口
    const handleClose = () => {
      userList.value = []
      selectUserId.value = []
      selectUserIdBak.value = []
      const refresh = isRefresh.value
      isRefresh.value = false
      emit('close-dialog', refresh)
    }

    const handleOpen = () => {
      getCorrelationUserId(props.params.dataId).then(res => {
        if (res.code === 200) {
          selectUserId.value = res.data
          selectUserIdBak.value = res.data
        }
      })
      getAllUserBase().then(res => {
        if (res.code === 200) {
          userList.value = res.data
        }
      })
    }

    const handleCallback = (res: AxiosResult) => {
      if (res.code == 200) {
        ElMessage.success(res.message)
        isRefresh.value = true
      }
    }
    
    const create = (userId: number) => {
      createUserItem(userId, props.params.dataId).then(res => {handleCallback(res)})
    }

    const remove = (userId: number) => {
      deleteUserItem(userId, props.params.dataId).then(res => {handleCallback(res)})
    }

    const teamChange = () => {
      // 选中
      const selectArr = selectUserId.value.filter(item => !selectUserIdBak.value.includes(item))
      if (selectArr.length > 0) {
        create(selectArr[0])
      }
      // 取消选中
      const unselectArr = selectUserIdBak.value.filter(item => !selectUserId.value.includes(item))
      if (unselectArr.length > 0) {
        remove(unselectArr[0])
      }
      selectUserIdBak.value = selectUserId.value
    }

    return {
      visible,
      handleOpen,
      handleClose,
      userList,
      selectUserId,
      teamChange,
    }
  },
})

</script>


<style scoped lang="scss">
  .item-team-main{
    padding: var(--pd-ultra-large);
    min-height: 200px;

    & .el-checkbox-group{
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: var(--mg-medium);

      & .el-checkbox:last-of-type{
        margin-right: 30px;
      }
    }
  }
</style>