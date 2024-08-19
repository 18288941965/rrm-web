<template>
  <div>
    <el-input
      v-model="queryParams.typeName"
      placeholder="请输入类型名称"
      class="mgb-medium"
      clearable
    >
      <template #append>
        <el-button
          :icon="Search"
          style="width: 100px"
          @click="query(1)"
        />
      </template>
    </el-input>

    <el-button
      class="mgb-medium"
      type="success"
      :icon="Plus"
      @click="dialogTypeOpen(undefined)"
    >
      创建字典类型
    </el-button>

    <el-table
      :data="pager.list"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="typeCode"
        label="类型代码"
      />
      <el-table-column
        prop="typeName"
        label="类型名称"
      />
      <el-table-column width="140px">
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="dialogTypeOpen(scope.row.id)"
          />

          <el-button
            type="danger"
            :icon="Delete"
            :disabled="scope.row.itemCount > 0"
            @click="deleteData(scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="itemCount"
        width="90px"
        align="center"
        label="字典项"
      >
        <template #default="scope">
          <el-button
            type="success"
            link
            style="width: 100%;"
            @click="setDictType(scope.row)"
          >
            {{ scope.row.itemCount }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <ev-pagination
      :pager="pager"
      @query="query"
    />

    <dict-type-edit-dialog
      v-bind="dialogType"
      @close-dialog="dialogTypeCloseAndRefresh($event,query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, onMounted, ref} from 'vue'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import {DictTypeBeanQuery, DictTypeBeanVO} from './dictModel'
import {Pagination} from '@utils/interface'
import {deleteDictType, searchDictTypePage} from './dictOption'
import {dialogBaseContent} from '@utils/dialogOptions'
import {Delete, Edit, Plus, Search} from '@element-plus/icons-vue'
import {deleteConfirm} from '@utils/utils'
import DictTypeEditDialog from './dict-type-edit-dialog.vue'

export default defineComponent({
  name: 'DictType',
  components: {
    DictTypeEditDialog,
    EvPagination,
  },
  emits: ['set-dict-type'],
  setup(props, { emit }) {
    const queryParams = reactive<DictTypeBeanQuery>({
      typeCode: '',
      typeName: '',
    })
    const pager = reactive<Pagination<DictTypeBeanVO>>({
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
      searchDictTypePage({
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
      dialogBase: dialogType,
      dialogBaseOpen: dialogTypeOpen,
      dialogBaseCloseAndRefresh: dialogTypeCloseAndRefresh,
    } = dialogBaseContent<number>()

    const deleteData = (id: number) => {
      deleteConfirm('你确定要删除此字典类型吗？').then(flag => {
        if (flag) {
          deleteDictType(id).then(res => {
            if (res.code === 200) {
              query(1)
            }
          })
        }
      })
    }

    const setDictType = (obj: DictTypeBeanVO) => {
      emit('set-dict-type', obj)
    }
    
    onMounted(() => {
      query(1)
    })
    
    return {
      Plus,
      Edit,
      Delete,
      Search,

      deleteData,
      setDictType,

      queryParams,
      query,
      pager,

      dialogType,
      dialogTypeOpen,
      dialogTypeCloseAndRefresh,
    }
  },
})
</script>



<style scoped lang="scss">

</style>