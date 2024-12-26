<template>
  <div>
    <el-form
      :model="queryParams"
      label-width="100px"
    >
      <div class="users-query-form-grid">
        <el-form-item label="姓名">
          <el-input
            v-model="queryParams.name"
            placeholder=""
            clearable
            style="max-width: 600px"
          />
        </el-form-item>
        
        <el-form-item label="用户名">
          <el-input
            v-model="queryParams.username"
            placeholder=""
            clearable
            style="max-width: 600px"
          />
        </el-form-item>
        
        <el-form-item label="用户状态">
          <ev-select
            v-model="queryParams.accountStatus"
            dict-type="dic_account_status"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
          />
        </el-form-item>
      </div>
    </el-form>
    
    <div class="mgb-medium users-toolbar">
      <el-button
        class="mgr-medium"
        type="success"
        :icon="Plus"
        @click="dialogBaseOpen(undefined)"
      >
        创建用户
      </el-button>

      <el-button
        class="mgb-medium"
        type="primary"
        :icon="Search"
        @click="query(1)"
      >
        查询
      </el-button>
    </div>

    <div class="users-body">
      <div
        v-for="(user, index) in pager.list"
        :key="'user-' + index"
        class="users-card"
      >
        <div class="users-base">
          <img
            :src="avatarM"
            alt=""
          >
          <div style="line-height: 26px">
            <div>{{ user.name }}</div>
            <div class="users-acc-status">
              <span
                v-if="user.accountStatus === '01'"
                class="acc-status-success"
              />
              <span
                v-else-if="user.accountStatus === '02'"
                class="acc-status-warning"
              />
              <span
                v-else-if="user.accountStatus === '03'"
                class="acc-status-warning"
              />
              <span
                v-else
                class="acc-status-warning"
              />
              {{ user.username }}
            </div>
            <div>
              <el-icon color="#666666">
                <User />
              </el-icon>
              {{ user.idNumber }}
            </div>
            <div>
              <el-icon color="#666666">
                <Iphone />
              </el-icon>
              {{ user.phoneNumber }}
            </div>
          </div>
        </div>

        <div class="users-base2">
          <span>{{ user.dateOfBirth }}</span>
          <el-divider direction="vertical" />
          <span>{{ user.genderName }}</span>
          <el-divider direction="vertical" />
          <span>{{ user.nationName }}</span>
        </div>

        <div class="users-org">
          <div class="org-item">
            <el-tooltip
              content="设为默认登录单位"
              placement="left-start"
            >
              <el-button
                text
                circle
              >
                <el-icon color="#999999">
                  <CircleCheckFilled />
                </el-icon>
              </el-button>
            </el-tooltip>
            <div>
              {{ user.orgName }}
            </div>
            <div>
              <el-tooltip
                content="绑定角色"
                placement="right-start"
              >
                <el-button
                  type="primary"
                  plain
                  text
                  circle
                  @click="dialogBaseOpen(user.id)"
                >
                  88
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div
            class="org-item"
          >
            <el-tooltip
              content="设为默认登录单位"
              placement="left-start"
            >
              <el-button
                text
                circle
              >
                <el-icon color="#999999">
                  <CircleCheckFilled />
                </el-icon>
              </el-button>
            </el-tooltip>
            <div>
              云南省XX市公安局交通警察支队HH高速公路交巡警二大队法制宣传中队
            </div>
            <div>
              <el-tooltip
                content="绑定角色"
                placement="right-start"
              >
                <el-button
                  type="primary"
                  plain
                  text
                  circle
                  @click="dialogBaseOpen(user.id)"
                >
                  56
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div
            class="org-item"
          >
            <el-tooltip
              content="设为默认登录单位"
              placement="left-start"
            >
              <el-button
                text
                circle
              >
                <el-icon
                  color="var(--el-color-success)"
                >
                  <CircleCheckFilled />
                </el-icon>
              </el-button>
            </el-tooltip>

            <div>
              云南省XX市公安局GGGG支队综合执法大队
            </div>
            <div>
              <el-tooltip
                content="绑定角色"
                placement="right-start"
              >
                <el-button
                  type="primary"
                  plain
                  text
                  circle
                  @click="dialogBaseOpen(user.id)"
                >
                  1
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div style="text-align: center;border-top: 1px solid var(--border-color);padding: 10px 0;">
          <el-button
            type="primary"
            :icon="Edit"
            @click="dialogBaseOpen(user.id)"
          />

          <el-button
            :icon="Delete"
            @click="deleteData(user.id)"
          />
        </div>
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
  Iphone,
  CircleCheckFilled,
  User,
} from '@element-plus/icons-vue'
import avatarM from '../../../assets/image/avatar-m.png'
import EvSelect from '../../../components/evcomp/ev-select.vue'

export default defineComponent({
  name: 'UsersIndex',
  components: {
    EvSelect,
    User,
    CircleCheckFilled,
    Iphone,
    UsersEditDialog,
    EvPagination,
  },
  setup() {

    const queryParams = reactive<UsersBeanQuery>({
      name: '',
      username: '',
      orgCode: '',
      orgName: '',
      accountStatus: '',
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
      avatarM,
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
  .users-query-form-grid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .users-body{
    display: flex;
    flex-wrap: wrap;
    & .users-card{
      width: 366px;
      margin-right: 15px;
      position: relative;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      margin-bottom: var(--mg-small);
      & .users-base{
        display: grid;
        grid-template-columns: 120px 1fr;
        padding: 10px;
        & img{
          width: 100px;
          height: 100px;
        }
      }
      & .users-base2{
        text-align: center;
        line-height: 40px;
        margin: 0 15px;
        border-bottom: 1px dotted var(--border-color);
      }

      & .users-org{
        color: var(--el-text-color-regular);
        & .org-item{
          margin: 6px;
          display: grid;grid-template-columns: 34px 1fr 34px;align-items: center;grid-gap: 5px;
          &:hover{
            color: #000000;
          }
        }
      }
    }
  }

  .users-acc-status{
    display: flex;
    align-items: center;
    color: var(--text-color-regular);
    & span{
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      margin-left: 4px;
      margin-right: 8px;
    }
    & .acc-status-success{
      background-color: var(--el-color-success);
    }
    & .acc-status-danger{
      background-color: var(--el-color-danger);
    }
    & .acc-status-warning{
      background-color: var(--el-color-warning);
    }
  }



</style>