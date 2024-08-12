<template>
  <div class="dict-grid">
    <section>
      <div class="mgb-medium">
        <el-button
          type="success"
          :icon="Plus"
          @click="dialogTypeOpen(undefined)"
        >
          创建字典类型
        </el-button>
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
        <el-table-column
          prop="description"
          label="描述"
        />
      </el-table>

      <ev-pagination
        :pager="pager"
        @query="query"
      />
    </section>
    <section />
    
    <dict-type-edit-dialog
      :data-id="dialogType.dataId as number"
      :show="dialogType.show"
      @close-dialog="dialogTypeCloseAndRefresh($event,query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, onMounted} from 'vue'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import {DictTypeBeanQuery, DictTypeBeanVO} from './dictModel'
import {searchWithPagination} from './dictOption'
import {Plus} from '@element-plus/icons-vue'
import {dialogBaseContent} from '@utils/dialogOptions'
import DictTypeEditDialog from './dict-type-edit-dialog.vue'
import {Pagination} from '@utils/interface'

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
      searchWithPagination(queryParams).then(res => {
        if (res.code === 200) {
          Object.assign(pager, res.data)
        }
      })
    }
    
    const {
      dialogBase: dialogType,
        dialogBaseOpen: dialogTypeOpen,
        dialogBaseCloseAndRefresh: dialogTypeCloseAndRefresh,
    } = dialogBaseContent()

    onMounted(() => {
      query(1)
    })
    
      return {
        Plus,
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
  .dict-grid{
    display: grid;
    grid-template-columns: 2fr 3fr;
  }
</style>