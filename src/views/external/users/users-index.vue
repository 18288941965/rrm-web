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
        label="姓名 / 性别 / 民族"
        width="200"
      >
        <template #default="scope">
          <div>
            {{ scope.row.name }}
          </div>
          <div class="users-g-n">
            <span>{{ scope.row.genderName }}</span>
            <span>{{ scope.row.nationName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="归属机构"
      />
      <el-table-column
        prop="username"
        label="用户名"
        width="130"
      />
      <el-table-column
        prop="idNumber"
        label="身份证号"
        width="186"
      />
      <el-table-column
        prop="dateOfBirth"
        label="出生日期"
        width="110"
      />
      <el-table-column
        prop="phoneNumber"
        label="手机号码"
        width="120"
      />
      <el-table-column
        prop="accountStatus"
        label="账号状态"
        width="100"
        align="center"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.accountStatus === 1"
            type="success"
            round
          >
            活跃
          </el-tag>
          <el-tag
            v-else-if="scope.row.accountStatus === -1"
            type="danger"
            round
          >
            禁止
          </el-tag>
          <el-tag
            v-else
            type="warning"
            round
          >
            锁定
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="approvalStatus"
        label="审核状态"
        width="110"
        align="center"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.approvalStatus === 1"
            type="success"
            round
          >
            审核通过
          </el-tag>
          <el-tag
            v-else-if="scope.row.approvalStatus === -1"
            type="info"
            round
          >
            审核中
          </el-tag>
          <el-tag
            v-else
            type="danger"
            round
          >
            审核不通过
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isDeleted"
        label="删除状态"
        width="90"
        align="center"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.isDeleted === 1"
            type="danger"
            round
          >
            是
          </el-tag>
          <el-tag
            v-else
            type="success"
            round
          >
            否
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="76"
        align="center"
      >
        <template #default="scope">
          <div class="mgb-medium">
            <el-button
              type="primary"
              :icon="Edit"
              @click="dialogBaseOpen(scope.row.id)"
            />
          </div>

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
import {UsersBeanVO, UsersBeanQuery} from './usersModel'
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
    
    const pager = reactive<Pagination<UsersBeanVO>>({
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
  .users-g-n{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2px;
    margin-top: var(--mg-ultra-small);
    & span{
      border: var(--border-1);
      background-color: var(--bg-color-banner);
      color: var(--color-black-secondary);
      text-align: center;
    }
    & span:first-child{
      border-top-left-radius: var(--border-radius-large);
      border-bottom-left-radius: var(--border-radius-large);
    }
    & span:last-child{
      border-top-right-radius: var(--border-radius-large);
      border-bottom-right-radius: var(--border-radius-large);
    }
  }
</style>