<template>
  <div>
    <div class="mgb-medium role-toolbar">
      <el-button
        class="mgr-medium"
        type="success"
        :icon="Plus"
        @click="dialogBaseOpen(undefined)"
      >
        创建角色
      </el-button>
      
      <el-input
        v-model="queryParams.name"
        placeholder="请输入角色名称"
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
        prop="sortOrder"
        label="顺序号"
        width="80px"
        align="center"
      />
      <el-table-column
        prop="name"
        label="角色名称"
      />
      <el-table-column
        prop="typeName"
        label="角色类型"
      />
      <el-table-column
        prop="description"
        label="角色描述"
      />
      <el-table-column
        prop="statusName"
        label="角色状态"
        width="100px"
        align="center"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            @change="setRoleStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column width="400">
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
          
          <el-button
            :icon="Apps"
            @click="dialogBindMenuOpen({ dataId: scope.row.id, name: scope.row.name })"
          >
            绑定菜单
            <span class="role-count-all">⟨ {{ countObj.menuCount }}</span>
            <span class="role-count-split">/</span>
            <span class="role-count-bind">{{ scope.row.bindMenuCount }} ⟩</span>
            <span class="role-count-all">⟨ {{ countObj.elementCount }}</span>
            <span class="role-count-split">/</span>
            <span class="role-count-bind">{{ scope.row.bindElementCount }} ⟩</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <ev-pagination
      :pager="pager"
      @query="query"
    />
    
    <role-edit-dialog
      v-bind="dialogBase"
      @close-dialog="dialogBaseCloseAndRefresh($event, query)"
    />
    
    <menu-select-dialog
      v-bind="dialogBindMenu"
      @close-dialog="dialogBindMenuCloseAndRefresh"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from 'vue'
import {Pagination} from '@utils/interface'
import {RoleBeanQuery, RoleBeanVO} from './roleModel'
import {deleteRole, searchRolePage, updateRoleStatus} from './roleOption'
import {dialogBaseContent, dialogParamsContent} from '@utils/dialogOptions'
import {Delete, Edit, Plus, Search} from '@element-plus/icons-vue'
import RoleEditDialog from './role-edit-dialog.vue'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import {ElMessage} from 'element-plus'
import {deleteConfirm} from '@utils/utils'
import {Apps} from '../../../components/svicon/menuIcon'
import MenuSelectDialog from '../menu/menu-select-dialog.vue'
import {countElement, countMenu} from '../menu/menuOption'

export default defineComponent({
  name: 'RoleIndex',
  components: {
    EvPagination,
    RoleEditDialog,
    MenuSelectDialog,
  },
  setup() {
    const queryParams = reactive<RoleBeanQuery>({
      name: '',
      type: '',
    })

    const pager = reactive<Pagination<RoleBeanVO>>({
      pageNum: 1,
      pageSize: 10,
      total: 0,
      list: [],
    })

    const countObj = reactive<{
      menuCount: number
      elementCount: number
    }>({
      menuCount: 0,
      elementCount: 0,
    })

    const query = (pageNum = pager.pageNum, pageSize = pager.pageSize) => {
      Object.assign(pager, {
        pageNum,
        pageSize,
      })
      searchRolePage({
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

    const setRoleStatus = (id: string, status: number) => {
      updateRoleStatus(id, status).then(res => {
        if (res.code !== 200) {
          for (let i = 0; i < pager.list.length; i++) {
            if (id === pager.list[i].id) {
              pager.list[i].status = status === 1 ? 0 : 1
              break
            }
          }
        } else {
          ElMessage.success(res.message)
        }
      })
    }

    const deleteData = (id: string) => {
      deleteConfirm('你确定要删除此角色吗？').then(flag => {
        if (flag) {
          deleteRole(id).then(res => {
            if (res.code === 200) {
              query(1)
            }
          })
        }
      })
    }

    const {
      dialogParam: dialogBindMenu,
        dialogParamsOpen: dialogBindMenuOpen,
        dialogParamsClose: dialogBindMenuClose,
    } = dialogParamsContent()

    const dialogBindMenuCloseAndRefresh = (menuSize: number, elementSize: number,  roleId: string) => {
      dialogBindMenuClose()
      pager.list.forEach(item => {
        if (item.id === roleId) {
          item.bindMenuCount = menuSize
          item.bindElementCount = elementSize
          return
        }
      })
    }

    onMounted(() => {
      query(1)

      countMenu().then(res => {
        if (res.code === 200) {
          countObj.menuCount = res.data
        }
      })

      countElement().then(res => {
        if (res.code === 200) {
          countObj.elementCount = res.data
        }
      })
    })
    
    return {
      Search,
      Plus,
      Edit,
      Delete,
      Apps,
      queryParams,
      pager,
      query,
      countObj,

      deleteData,
      setRoleStatus,

      dialogBase,
      dialogBaseOpen,
      dialogBaseCloseAndRefresh,

      dialogBindMenu,
      dialogBindMenuOpen,
      dialogBindMenuCloseAndRefresh,
    }
  },
})
</script>

<style scoped lang="scss">
  .role-toolbar{
    display: flex;
    align-items: center;
  }
  .role-count-all{
    display: inline-block;
    margin-left: var(--mg-ultra-small);
    font-weight: bold;
  }
  .role-count-split{
    padding: 0 var(--pd-ultra-small);
  }
  .role-count-bind{
    font-weight: bold;
    color: var(--color-orange);
  }
</style>