<template>
  <div>
    <div class="mgb-medium users-toolbar">
      <el-button
        class="mgr-medium"
        type="success"
        :icon="Plus"
        @click="dialogBaseOpen(undefined)"
      >
        创建用户
      </el-button>

      <el-input
        v-model="queryParams.name"
        placeholder="请输入用户名称"
        clearable
        style="max-width: 600px"
      >
        <template #append>
          <el-button
            :icon="Search"
            style="width: 100px"
            @click="query(1)"
          />
        </template>
      </el-input>
    </div>

    <el-table
      :data="pager.list"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="姓名"
      />
      <el-table-column
        prop="orgName"
        label="归属机构"
      />
      <el-table-column
        prop="username"
        label="用户名"
      />
      <el-table-column
        prop="gender"
        label="性别"
      />
      <el-table-column
        prop="nation"
        label="民族"
      />
      <el-table-column
        prop="idNumber"
        label="身份证号"
      />
      <el-table-column
        prop="dateOfBirth"
        label="出生日期"
      />
      <el-table-column
        prop="phoneNumber"
        label="手机号码"
      />
      <el-table-column
        prop="accountStatus"
        label="账号状态"
      />
      <el-table-column
        prop="approvalStatus"
        label="审核状态"
      />
      <el-table-column
        prop="isDeleted"
        label="删除状态"
      />
      <el-table-column width="140px">
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="dialogBaseOpen(scope.row.id)"
          />

          <el-button
            type="danger"
            :icon="Delete"
            @click="deleteData(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <ev-pagination
      :pager="pager"
      @query="query"
    />

    <users-edit-dialog
      v-bind="dialogBase"
      @close-dialog="dialogBaseCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from 'vue'
import {UsersBean, UsersBeanQuery} from './usersModel'
import {Pagination} from '@utils/interface'
import {dialogBaseContent} from '@utils/dialogOptions'
import {deleteUsers, searchUsersPage} from './usersOption'
import {deleteConfirm} from '@utils/utils'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import UsersEditDialog from './users-edit-dialog.vue'
import {
  Search,
  Plus,
  Edit,
  Delete,
} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'UsersIndex',
  components: {
    UsersEditDialog,
    EvPagination,
  },
  setup() {

    const queryParams = reactive<UsersBeanQuery>({
      name: '',
      orgCode: '',
      orgName: '',
    })
    
    const pager = reactive<Pagination<UsersBean>>({
      pageNum: 1,
      pageSize: 10,
      total: 0,
      list: [],
    })

    const query = (pageNum = pager.pageNum, pageSize = pager.pageSize) => {
      Object.assign(pager, {
        pageNum,
        pageSize,
      })
      searchUsersPage({
        pageNum: pager.pageNum,
        pageSize: pager.pageSize,
        ...queryParams,
      }).then(res => {
        if (res.code === 200) {
          Object.assign(pager, res.data)
        }
      })
    }

    const {
      dialogBase,
      dialogBaseOpen,
      dialogBaseCloseAndRefresh,
    } = dialogBaseContent<string>()

    const deleteData = (id: string) => {
      deleteConfirm('你确定要删除此用户吗？').then(flag => {
        if (flag) {
          deleteUsers(id).then(res => {
            if (res.code === 200) {
              query(1)
            }
          })
        }
      })
    }

    onMounted(() => {
      query(1)
    })

    return {
      Search,
      Plus,
      Edit,
      Delete,
      queryParams,
      pager,
      query,
      deleteData,

      dialogBase,
      dialogBaseOpen,
      dialogBaseCloseAndRefresh,
    }
  },
})
</script>

<style scoped lang="scss">

</style>