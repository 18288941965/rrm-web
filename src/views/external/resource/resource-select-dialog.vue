<template>
  <el-dialog
    v-model="visible"
    top="100px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <template #header>
      <dialog-header
        title="绑定资源"
        :name="params.name"
      />
    </template>

    <div class="res-select-main">
      <div>
        <div class="query-card">
          <el-select
            v-model="queryParams.serviceName"
            clearable
            placeholder="服务名称"
          >
            <el-option
              v-for="(item, index) in serviceNameList"
              :key="'q-c-' + index"
              :value="item"
              :label="item"
            />
          </el-select>
          <ev-select
            v-model="queryParams.resourceType"
            dict-type="dic_res_type"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
            placeholder="资源类型"
            @change="query(1)"
          />
          <ev-select
            v-model="queryParams.authCode"
            dict-type="dic_res_auth_code"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
            placeholder="授权类型"
            @change="query(1)"
          />
          <ev-select
            v-model="queryParams.environment"
            dict-type="dic_res_environment"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
            placeholder="生效环境"
            @change="query(1)"
          />
        </div>
        
        <el-table
          :data="pager.list"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="packageName"
            label="包名"
            width="260px"
          />
          <el-table-column
            prop="className"
            label="类名"
            width="220px"
          >
            <template #header>
              <el-input
                v-model="queryParams.className"
                clearable
                placeholder="类名"
                @keyup.enter="query(1)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="methodName"
            label="方法名"
            width="180"
          />
          <el-table-column
            prop="requestPath"
            label="请求路径"
            width="280px"
          />
          <el-table-column
            prop="resourceName"
            label="资源名称"
            width="240px"
          >
            <template #header>
              <el-input
                v-model="queryParams.resourceName"
                clearable
                placeholder="资源名称"
                @keyup.enter="query(1)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="sel_"
            width="80px"
            align="center"
            label="选择"
          >
            <template #default="scope">
              <el-button
                class="al-hover"
                @click="selectRow(scope.row)"
              >
                <arrow-line />
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <ev-pagination
          :pager="pager"
          @query="query"
        />
      </div>

      <div class="mgl-medium">
        <el-table
          :data="selectObj.selectData"
          border
          style="width: 100%;"
        >
          <el-table-column
            prop="methodName"
            label="方法名"
            width="180"
          />
          <el-table-column
            prop="resourceName"
            label="资源名称"
          />
          <el-table-column
            prop="sel_"
            width="80px"
            align="center"
          >
            <template #default="scope">
              <el-button
                :icon="Remove"
                @click="selectRow(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, watch, ref} from 'vue'
import {dialogOptions} from '@utils/dialogOptions'
import {Pagination, PropPrams} from '@utils/interface'
import DialogHeader from '../../../components/dialog-header.vue'
import {ResourceBeanVO, ResourceQuery} from './resourceModel'
import {getServiceNameList, searchResourcePage} from './resourceOption'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import EvSelect from '../../../components/evcomp/ev-select.vue'
import {ArrowLine} from '../../../components/svicon/publicIcon'
import {Remove} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ResourceSelectDialog',
  components: {
    ArrowLine,
    EvSelect,
    EvPagination,
    DialogHeader,
  },
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          dataId: '',
          name: '',
        }
      },
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup(props, { emit }) {
    const {
      visible,
      isRefresh,
    } = dialogOptions()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )
    const serviceNameList = ref<Array<string>>([])
    const queryParams = reactive<ResourceQuery>({
      status: 1,
      serviceName: '',
      className: '',
      resourceName: '',
      requestMethod: '',
      resourceType: '',
      authCode: '',
      environment: '',
    })

    const selectObj = reactive<{
      selectId: Array<String>
      selectData: Array<ResourceBeanVO>
    }>({
      selectId: [],
      selectData: [],
    })
    const pager = reactive<Pagination<ResourceBeanVO>>({
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
      searchResourcePage({
        pageNum: pager.pageNum,
        pageSize: pager.pageSize,
        ...queryParams,
      }).then(res => {
        if (res.code === 200) {
          Object.assign(pager, res.data)
        }
      })
    }

    const selectRow = (row: ResourceBeanVO) => {
      selectObj.selectId.push(row.id)
      selectObj.selectData.push(row)
    }
    const removeRow = (index: number) => {
      selectObj.selectId.splice(index, 1)
      selectObj.selectData.splice(index, 1)
    }

    // 关闭窗口
    const handleClose = () => {
      const refresh = isRefresh.value
      isRefresh.value = false
      emit('close-dialog', refresh)
    }
    
    const handleOpen = () => {
      getServiceNameList().then(res => {
        if (res.code === 200) {
          serviceNameList.value = res.data
        }
      })
      if (props.params.dataId) {
        query(1)
      }
    }

    return {
      Remove,
      visible,
      handleOpen,
      handleClose,

      serviceNameList,
      queryParams,
      pager,
      query,
      selectRow,
      selectObj,
      removeRow,
    }
  },
})
</script>

<style scoped lang="scss">
  .res-select-main{
    display: flex;
  }
  .query-card{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 10px;
    margin-bottom: var(--mg-medium);
  }
</style>