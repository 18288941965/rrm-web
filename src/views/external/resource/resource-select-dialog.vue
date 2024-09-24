<template>
  <el-dialog
    v-model="visible"
    top="100px"
    width="98%"
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
      <el-tree
        class="res-select-tree"
        :data="treeData"
        :props="{ label: 'name' }"
        accordion
        @node-click="handleNodeClick"
      />
      
      <div class="wait-select-list">
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
          <el-input
            v-model="queryParams.packageName"
            clearable
            placeholder="包名"
            @keyup.enter="query(1)"
          />
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
          <div>
            <el-button 
              type="primary"
              :icon="Search"
              @click="query(1)"
            >
              检索
            </el-button>
          </div>
        </div>
        
        <el-table
          :data="pager.list"
          border
          size="small"
        >
          <el-table-column
            prop="className"
            label="类名"
            width="200"
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
            width="200"
          >
            <template #header>
              <el-input
                v-model="queryParams.methodName"
                clearable
                placeholder="方法名"
                @keyup.enter="query(1)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="requestPath"
            label="请求路径"
            width="200"
          >
            <template #header>
              <el-input
                v-model="queryParams.requestPath"
                clearable
                placeholder="请求路径"
                @keyup.enter="query(1)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="resourceName"
            label="资源名称"
            width="200"
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
            width="66"
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

      <div class="select-list">
        <el-table
          :data="selectObj.selectData"
          border
          size="small"
        >
          <el-table-column
            prop="methodName"
            label="方法名"
            width="200"
          />
          <el-table-column
            prop="resourceName"
            label="资源名称"
            width="200"
          />
          <el-table-column
            prop="sel_"
            width="66"
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
import {defineComponent, PropType, reactive, ref, watch} from 'vue'
import {dialogOptions} from '@utils/dialogOptions'
import {Pagination, PropPrams} from '@utils/interface'
import DialogHeader from '../../../components/dialog-header.vue'
import {PackageNameTree, ResourceBeanVO, ResourceQuery} from './resourceModel'
import {getPackageNameByTree, getServiceNameList, searchResourcePage} from './resourceOption'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import EvSelect from '../../../components/evcomp/ev-select.vue'
import {ArrowLine} from '../../../components/svicon/publicIcon'
import {Remove, Search} from '@element-plus/icons-vue'
import type Node from 'element-plus/es/components/tree/src/model/node'

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
    const treeData = ref<Array<PackageNameTree>>([])

    const serviceNameList = ref<Array<string>>([])
    const queryParams = reactive<ResourceQuery>({
      serviceName: '',
      className: '',
      resourceName: '',

      packageName: '',
      methodName: '',
      requestPath: '',
      requestMethod: '',
      resourceType: '',
      authCode: '',
      environment: '',
      status: 1,
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
      getPackageNameByTree().then(res => {
        if (res.code === 200) {
          treeData.value = res.data
        }
      })
      if (props.params.dataId) {
        query(1)
      }
    }

    const getNodePath = (node: Node) => {
      const path = []
      let currentNode = node
      while (currentNode) {
        path.unshift(currentNode.label) // 假设节点的标签是 'label'
        currentNode = currentNode.parent // 确保节点有父节点
      }
      return path.filter(item => item)
    }
    
    const handleNodeClick = (data: PackageNameTree, node: Node) => {
      const nodePath = getNodePath(node)
      queryParams.serviceName = nodePath[0]
      if (nodePath.length > 1) {
        nodePath.splice(0, 1)
        queryParams.packageName = nodePath.join('.')
      }
    }

    return {
      Remove,
      Search,
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

      treeData,
      handleNodeClick,
    }
  },
})
</script>

<style scoped lang="scss">
  .res-select-main{
    display: grid;
    grid-template-columns: 230px 866px 466px;
    grid-gap: 10px;
    max-width: 1584px;
    margin: auto;
    overflow: auto;
    & .res-select-tree{
      width: 230px;
      border: var(--border-1);
      border-radius: var(--border-radius-medium);
    }
  }
  .query-card{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    margin-bottom: var(--mg-medium);
  }
</style>