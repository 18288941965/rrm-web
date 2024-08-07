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
import {getCorrelationUserId} from './itemOption'
import {PropPrams} from '@utils/interface'

export default defineComponent({
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          dataId: 0,
          itemId: '',
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
    const visible = ref(false)
    const refresh = ref(false)
    const userList = ref<Array<UserBean>>([])
    const selectUserId = ref<Array<number>>([])

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    // 关闭窗口
    const handleClose = () => {
      userList.value = []
      const tmp = refresh.value
      refresh.value = false
      emit('close-dialog', tmp)
    }

    const onSubmit = () => {

    }

    const handleOpen = () => {
      getCorrelationUserId(props.params.dataId).then(res => {
        if (res.code === 200) {
          selectUserId.value = res.data
        }
      })
      getAllUserBase().then(res => {
        if (res.code === 200) {
          userList.value = res.data
        }
      })
    }

    const teamChange = (value: string | number | boolean) => {
      console.log(value)
    }

    return {
      visible,
      handleOpen,
      handleClose,
      onSubmit,
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
  }
</style>