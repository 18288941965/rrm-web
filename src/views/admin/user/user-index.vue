<template>
  <div>
    <el-button
      class="mgb-medium"
      type="success"
      :icon="Plus"
      @click="dialogEmptyOpen"
    >
      创建用户
    </el-button>
    
    <el-table
      :data="userList"
      border
    >
      <el-table-column
        prop="username"
        label="用户名"
      />
      <el-table-column
        prop="comment"
        label="备注"
      />
      <el-table-column>
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="dialogParamsOpen({ dataId: scope.row.id, comment: scope.row.comment })"
          />

          <el-button
            type="danger"
            :icon="Delete"
            :disabled="scope.row.username === activeUsername"
            @click="deleteData(scope.row.username, scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <user-add
      v-bind="dialogEmpty"
      @close-dialog="dialogEmptyCloseAndRefresh($event, query)"
    />

    <user-edit
      v-bind="dialogParam"
      @close-dialog="dialogParamsCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import {UserBean} from './userModel'
import {deleteUser, getAllUser, validatePass} from './userOption'
import {Delete, Edit, Plus} from '@element-plus/icons-vue'
import {dialogEmptyContent, dialogParamsContent} from '@utils/dialogOptions'
import UserAdd from './user-add.vue'
import UserEdit from './user-edit.vue'
import LocalStorage from '../../../class/LocalStorage'
import {ElMessageBox} from 'element-plus'
import {ElMessage} from 'element-plus/es'

export default defineComponent({
  name: 'UserIndex',
  components: {
    UserAdd,
    UserEdit,
  },
  setup() {
      const userList = ref<Array<UserBean>>([])
    const activeUsername = ref('')
    
    const query = () => {
      getAllUser().then(data => {
        if (data.code === 200) {
          userList.value = data.data
        }
      })
    }

    const {
     dialogEmpty,
        dialogEmptyOpen,
        dialogEmptyCloseAndRefresh,
    } = dialogEmptyContent()

    const {
        dialogParam,
        dialogParamsOpen,
      dialogParamsCloseAndRefresh,
    } = dialogParamsContent()

    const deleteData = (username: string, id: number) => {
      ElMessageBox.prompt('请输入要删除账户的密码', 'Tip', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
      })
          .then(({value}) => {
            validatePass({username, password: value}).then(res => {
              if (res.data) {
                deleteUser(id).then(delRes => {
                  if (delRes.code == 200) {
                    query()
                  }
                })
              } else {
                ElMessage.error('输入密码不正确！')
              }
            })
          })
          .catch(() => {
          })
    }

    onMounted(() => {
      activeUsername.value = new LocalStorage().getUserInfoObj().userName
      query()
    })

    return {
      Plus, 
      Delete, 
      Edit,
      query,
      activeUsername,
      userList,
      deleteData,
      dialogEmpty,
      dialogEmptyOpen,
      dialogEmptyCloseAndRefresh,

      dialogParam,
      dialogParamsOpen,
      dialogParamsCloseAndRefresh,
    }
  },
})
</script>



<style scoped lang="scss">

</style>