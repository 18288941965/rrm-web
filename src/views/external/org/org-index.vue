<template>
  <div>
    <div class="mgb-medium org-toolbar">
      <el-button
        class="mgr-medium"
        type="success"
        :icon="Plus"
        @click="dialogBaseOpen(undefined)"
      >
        创建机构
      </el-button>

      <el-input
        v-model="queryParams.name"
        placeholder="请输入机构名称"
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
        label="机构名称"
      />
      <el-table-column
        prop="level"
        label="机构等级"
      />
      <el-table-column
        prop="description"
        label="机构描述"
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

    <org-edit-dialog
      v-bind="dialogBase"
      @close-dialog="dialogBaseCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from 'vue'
import {OrgBean, OrgBeanQuery} from './orgModel'
import {Pagination} from '@utils/interface'
import {dialogBaseContent} from '@utils/dialogOptions'
import {deleteOrg, searchOrgPage} from './orgOption'
import {deleteConfirm} from '@utils/utils'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import OrgEditDialog from './org-edit-dialog.vue'
import {
  Search,
  Plus,
    Edit,
    Delete,
} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'OrgIndex',
  components: {
    OrgEditDialog,
    EvPagination,
  },
  setup(props, ctx) {

    const queryParams = reactive<OrgBeanQuery>({
      name: '',
      code: '',
    })

    const pager = reactive<Pagination<OrgBean>>({
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
      searchOrgPage({
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
          deleteOrg(id).then(res => {
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