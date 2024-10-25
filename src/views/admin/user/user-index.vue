<template>
  <div>
    <el-button
      class="mgb-medium"
      type="success"
      :icon="Plus"
      @click="dialogEmptyOpen"
    >
      创建账号
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
      table-layout="auto"
    >
      <el-table-column
        prop="username"
        label="账号"
        width="220"
      >
        <template #default="scope">
          <span>{{ scope.row.username }}</span>
          <el-tag
            v-if="scope.row.username === activeUsername"
            type="success"
            class="mgl-medium"
            round
          >
            登录账号
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="createdAt"
        label="创建时间"
        width="170"
      />

      <el-table-column
        prop="createdUsername"
        label="创建人"
        width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.createdUsername">{{ scope.row.createdUsername }}</span>
          <span
            v-else
            class="user-root-tag"
          >root</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="description"
        label="描述"
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
                v-if="scope.row.id === item.createdBy"
                size="small"
                type="primary"
                round
                class="mgr-medium"
              >
                项目所有权
              </el-tag>
              <el-tag
                v-else
                type="info"
                round
                class="mgr-medium"
              >
                项目维护权
              </el-tag>
              <span>{{ item.itemName }}</span>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="dialogParamsOpen({ dataId: scope.row.id, description: scope.row.description })"
          />

          <el-button
            type="danger"
            :icon="Delete"
            :disabled="!scope.row.createdBy || scope.row.createdBy !== scope.row.loginId"
            @click="deleteData(scope.row.username, scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <user-add-dialog
      v-bind="dialogEmpty"
      @close-dialog="dialogEmptyCloseAndRefresh($event, query)"
    />

    <user-edit-dialog
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
import UserAddDialog from './user-add-dialog.vue'
import UserEditDialog from './user-edit-dialog.vue'
import LocalStorage from '../../../class/LocalStorage'
import {ElMessageBox} from 'element-plus'
import {ElMessage} from 'element-plus/es'

export default defineComponent({
  name: 'UserIndex',
  components: {
    UserAddDialog,
    UserEditDialog,
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
        const find = userObj.itemList.find(item => item.createdBy === id)
        if (find) {
          ElMessage.error('请先删除当前账号创建的项目，才能删除此账号！')
          return
        }
      }

      ElMessageBox.prompt('请输入要删除账号的密码', 'Tip', {
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
    display: flex;
    align-items: center;
    line-height: var(--size-medium);
  }
  .user-root-tag{
    color: var(--color-purple);
  }
</style>