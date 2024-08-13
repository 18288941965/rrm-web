<template>
  <div class="dict-grid">
    <section class="layout-sidebar">
      <div class="mgb-medium sidebar-flex">
        <el-button
          type="success"
          :icon="Plus"
          @click="dialogTypeOpen(undefined)"
        >
          创建字典类型
        </el-button>

        <el-input
          v-model="queryParams.typeName"
          placeholder="请输入类型名称"
          class="mgl-medium"
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
      </div>

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
              :disabled="scope.row.itemCount"
              @click="deleteData(scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="itemCount"
          width="100px"
          align="center"
          label="字典项"
        >
          <template #default="scope">
            <el-button
              type="success"
              link
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
    </section>
    <section class="layout-main">
      <div class="top-flex">
        <h5>
          <span>字典项管理</span>
        </h5>

        <h5>
          {{ selectDictType.typeName }}
          <span v-if="selectDictType.id">（{{ selectDictType.typeCode }}）</span>
        </h5>
      
        <el-button
          type="success"
          :icon="Plus"
          @click="dialogTypeOpen(undefined)"
        >
          创建字典项
        </el-button>
      </div>
    </section>
    
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
import {deleteDictType, searchDictTypePage} from './dictOption'
import {Plus, Edit, Delete, Search} from '@element-plus/icons-vue'
import {dialogBaseContent} from '@utils/dialogOptions'
import DictTypeEditDialog from './dict-type-edit-dialog.vue'
import {Pagination} from '@utils/interface'
import {deleteConfirm} from '@utils/utils'

export default defineComponent({
  name: 'DictIndex',
  components: {
    EvPagination,
    DictTypeEditDialog,
  },
  setup() {
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

    const selectDictType = ref<DictTypeBeanVO>({
      description: '',
      id: 0,
      itemCount: 0,
      typeCode: '',
      typeName: '',
    })

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
      selectDictType.value = obj
    }

    onMounted(() => {
      query(1)
    })
    
      return {
        Plus,
        Edit,
        Delete,
        Search,
        queryParams,
        query,
        pager,
        setDictType,
        selectDictType,
        deleteData,
        dialogType,
        dialogTypeOpen,
        dialogTypeCloseAndRefresh,
      }
  },
})
</script>

<style scoped lang="scss">
  .dict-grid{
    display: grid;
    grid-template-columns: 2fr 3fr;
    grid-column-gap: var(--mg-medium);
    & .layout-sidebar{
      & .sidebar-flex{
        display: flex;
      }
    }
    & .layout-main{
      border: var(--border-1);
      border-radius: var(--border-radius-medium);
      & h5{
        & span{
          color: var(--color-black-secondary);
        }
      }

      & .top-flex{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: var(--border-1);
        padding: 4px;
        background-color: var(--bg-color-header);
        border-top-left-radius: var(--border-radius-medium);
        border-top-right-radius: var(--border-radius-medium);
      }
    }
  }
</style>