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

    <div
      v-for="(user, index) in pager.list"
      :key="'user-' + index"
      style="display: grid;grid-template-columns: 240px 200px 1fr 1fr;border: 1px solid;margin-bottom: var(--mg-small)"
    >
      <div style="display: grid;grid-template-columns: 32px 1fr; align-items: center;">
        <PersonFill :size="32" />
        <div>
          <el-tag
            v-if="user.accountStatus === 1"
            type="success"
            round
          >
            正常
          </el-tag>
          <el-tag
            v-else-if="user.accountStatus === -1"
            type="danger"
            round
          >
            禁用
          </el-tag>
          <el-tag
            v-else
            type="warning"
            round
          >
            锁定
          </el-tag>
          <div>{{ user.name }}</div>
          <div>{{ user.idNumber }}</div>
        </div>
      </div>
      <div>
        <div>出生日期：{{ user.dateOfBirth }}</div>
        <div>性别：{{ user.genderName }}</div>
        <div>民族：{{ user.nationName }}</div>
        <div>手机号码：{{ user.phoneNumber }}</div>
      </div>
      <div>
        <div>用户名：{{ user.username }}</div>
        <div>所属机构：{{ user.orgName }}</div>
      </div>
      <div>
        <el-button
          :icon="Link"
          @click="dialogBaseOpen(user.id)"
        >
          绑定角色
        </el-button>
        
        <el-button
          type="primary"
          :icon="Edit"
          @click="dialogBaseOpen(user.id)"
        />

        <el-button
          type="danger"
          :icon="Delete"
          @click="deleteData(user.id)"
        />
      </div>
    </div>

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
    Link,
} from '@element-plus/icons-vue'
import {PersonFill} from '../../../components/svicon/publicIcon'

export default defineComponent({
  name: 'UsersIndex',
  components: {
    UsersEditDialog,
    EvPagination,
    PersonFill,
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
      Link,
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
      font-size: var(--h6-size);
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