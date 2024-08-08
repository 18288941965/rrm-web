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

    <el-button
      class="mgb-medium"
      :icon="Refresh"
      @click="query"
    >
      刷新页面
    </el-button>
    
    <el-table
      :data="userList"
      border
    >
      <el-table-column
        prop="username"
        width="200px"
        label="用户名"
      >
        <template #default="scope">
          <span>{{ scope.row.username }}</span>
          <el-tag
            v-if="scope.row.username === activeUsername"
            type="success"
            class="mgl-medium"
          >
            登录用户
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="comment"
        label="备注"
      />
      <el-table-column
        prop="itemList"
        label="关联项目"
      >
        <template #default="scope">
          <ul class="user-index-item">
            <li
              v-for="(item, index) in scope.row.itemList"
              :key="scope.$index + '_' + index"
            >
              <el-tag
                v-if="scope.row.id === item.userId"
                size="small"
                type="primary"
              >
                项目所有权
              </el-tag>
              <el-tag
                v-else
                type="info"
              >
                项目维护权
              </el-tag>
              <span>{{ item.itemName }}</span>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column width="180px">
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
import {UserItemBean} from './userModel'
import {deleteUser, getAllUser, validatePass} from './userOption'
import {Delete, Edit, Plus, Refresh} from '@element-plus/icons-vue'
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
      const userList = ref<Array<UserItemBean>>([])
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
      const userObj = userList.value.find(user => user.id === id)
      if (userObj) {
        const find = userObj.itemList.find(item => item.userId === id)
        if (find) {
          ElMessage.error('请先删除当前用户创建的项目，才能删除此用户！')
          return
        }
      }

      ElMessageBox.prompt('请输入要删除用户的密码', 'Tip', {
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
      Refresh,
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
  .user-index-item li{
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-column-gap: 20px;
    align-items: center;
    line-height: var(--size-default);
    &:hover{
      background-color: var(--bg-color-hover);
    }
  }
</style>