<template>
  <div>
    <div class="top-flex">
      <h5>
        <span>字典项管理</span>
        {{ selectDictType.typeName }}
        <span v-if="selectDictType.id">（{{ selectDictType.typeCode }}）</span>
      </h5>

      <div class="input-g mgl-medium">
        <el-input
          v-model="queryParams.entryName"
          placeholder="请输入字典名称"
          class="mgb-medium"
          clearable
        >
          <template #append>
            <el-button
              :icon="Search"
              :disabled="!selectDictType.typeCode"
              style="width: 100px"
              @click="query(1)"
            />
          </template>
        </el-input>
      </div>
    </div>

    <el-button
      :disabled="!selectDictType.typeCode"
      class="mgb-medium"
      type="success"
      :icon="Plus"
      @click="dialogItemOpen({ dataId: 0, typeId: selectDictType.id, typeName: selectDictType.typeName })"
    >
      创建字典项
    </el-button>

    <el-button
      :disabled="!selectDictType.typeCode || pager.list.length === 0"
      class="mgb-medium"
      :icon="Sort"
      @click="dialogBaseOpen(selectDictType.id)"
    >
      字典项排序
    </el-button>

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
        prop="entryCode"
        label="字典代码"
      />
      <el-table-column
        prop="entryName"
        label="字典名称"
      />
      <el-table-column
        prop="parentEntryName"
        label="上级字典"
      />
      <el-table-column
        prop="statusName"
        label="字典状态"
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
            @change="setDictEntryStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column width="140px">
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="dialogItemOpen({ dataId: scope.row.id, typeId: selectDictType.id, typeName: selectDictType.typeName })"
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

    <dict-entry-edit-dialog
      v-bind="dialogItem"
      @close-dialog="dialogItemCloseAndRefresh"
    />

    <dict-entry-sort-dialog
      v-bind="dialogBase"
      @close-dialog="dialogBaseCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, watchEffect} from 'vue'
import {dialogBaseContent, dialogParamsContent} from '@utils/dialogOptions'
import {Delete, Edit, Plus, Search, Sort} from '@element-plus/icons-vue'
import DictEntryEditDialog from './dict-entry-edit-dialog.vue'
import {DictEntryBean, DictEntryBeanQuery, DictTypeBeanVO} from './dictModel'
import {Pagination} from '@utils/interface'
import {deleteDictEntry, searchDictEntryPage, updateDictEntryStatus} from './dictOption'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import {deleteConfirm} from '@utils/utils'
import {ElMessage} from 'element-plus/es'
import DictEntrySortDialog from './dict-entry-sort-dialog.vue'

export default defineComponent({
  name: 'DictEntry',
  components: {
    EvPagination, 
    DictEntryEditDialog,
    DictEntrySortDialog,
  },
  props: {
    selectDictType: {
      type: Object as PropType<DictTypeBeanVO>,
      default: () => {
        return {
          description: '',
          id: 0,
          entryCount: 0,
          typeCode: '',
          typeName: '',
        }
      },
    },
  },
  emits: ['set-entry-count'],
  setup(props, { emit }) {
    const queryParams = reactive<DictEntryBeanQuery>({
      typeId: 0,
      entryName: '',
      entryCode: '',
    })

    const pager = reactive<Pagination<DictEntryBean>>({
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
      searchDictEntryPage({
        pageNum: pager.pageNum,
        pageSize: pager.pageSize,
        ...queryParams,
      }).then(res => {
        if (res.code === 200) {
          Object.assign(pager, res.data)
        }
      })
    }

    watchEffect(() => {
      if (props.selectDictType.id) {
        queryParams.typeId = props.selectDictType.id
        query(1)
      }
    })

    const setEntryCount = (flag: number) => {
      emit('set-entry-count', flag)
    }

    const deleteData = (id: number) => {
      deleteConfirm('你确定要删除此字典项吗？').then(flag => {
        if (flag) {
          deleteDictEntry(id).then(res => {
            if (res.code === 200) {
              query(1)
              setEntryCount(-1)
            }
          })
        }
      })
    }

    const {
      dialogBase,
        dialogBaseOpen,
        dialogBaseCloseAndRefresh,
    } = dialogBaseContent<number>()
    
    const {
      dialogParam: dialogItem,
      dialogParamsOpen: dialogItemOpen,
      dialogParamsClose,
    } = dialogParamsContent()

    const dialogItemCloseAndRefresh = (refresh: boolean, add: boolean) => {
      dialogParamsClose()
      if (refresh) {
        query(1)
      }
      if (add) {
        setEntryCount(1)
      }
    }

    const setDictEntryStatus = (id: number, status: number) => {
      updateDictEntryStatus(id, status).then(res => {
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
    
    return {
      Plus,
      Edit,
      Delete,
      Search,

      pager,
      query,
      deleteData,
      setDictEntryStatus,

      queryParams,
      dialogItem,
      dialogItemOpen,
      dialogItemCloseAndRefresh,

      dialogBase,
      dialogBaseOpen,
      dialogBaseCloseAndRefresh,
    }
  },
  computed: {
    Sort() {
      return Sort
    },
  },
})
</script>

<style scoped lang="scss">
 h5 {
   line-height: var(--size-default);
   & span{
     color: var(--color-black-secondary);
   }
 }
.top-flex{
  display: flex;
  justify-content: space-between;
  & .input-g{
    flex: 1;
  }
}
</style>