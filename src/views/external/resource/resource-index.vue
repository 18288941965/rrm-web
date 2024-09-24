<template>
  <div>
    <el-form
      :model="queryParams"
      label-width="100px"
    >
      <div class="resource-query-form-grid">
        <el-form-item label="服务名称">
          <el-input
            v-model="queryParams.serviceName"
            clearable
            @keyup.enter="query(1)"
          />
        </el-form-item>
        <el-form-item label="类名">
          <el-input
            v-model="queryParams.className"
            clearable
            @keyup.enter="query(1)"
          />
        </el-form-item>
        <el-form-item label="资源名称">
          <el-input
            v-model="queryParams.resourceName"
            clearable
            @keyup.enter="query(1)"
          />
        </el-form-item>
        <el-form-item label="请求方式">
          <ev-select
            v-model="queryParams.requestMethod"
            dict-type="dic_axios_type"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
            @change="query(1)"
          />
        </el-form-item>
      </div>

      <div class="resource-query-form-grid">
        <el-form-item label="资源类型">
          <ev-select
            v-model="queryParams.resourceType"
            dict-type="dic_res_type"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
            @change="query(1)"
          />
        </el-form-item>

        <el-form-item label="授权类型">
          <ev-select
            v-model="queryParams.authCode"
            dict-type="dic_res_auth_code"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
            @change="query(1)"
          />
        </el-form-item>

        <el-form-item label="生效环境">
          <ev-select
            v-model="queryParams.environment"
            dict-type="dic_res_environment"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
            @change="query(1)"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            @click="query(1)"
          >
            查询
          </el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-button
      class="mgb-medium"
      type="success"
      :icon="Reading"
      @click="runScannerRrmResource"
    >
      扫描系统资源
    </el-button>
    
    <el-table
      :data="pager.list"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="serviceName"
        width="90"
        label="服务名称"
      />
      <el-table-column
        prop="packageName"
        label="包名"
        width="260px"
      />
      <el-table-column
        prop="className"
        label="类名"
      />
      <el-table-column
        prop="methodName"
        label="方法名"
      />
      <el-table-column
        prop="requestPath"
        label="请求路径"
      />
      <el-table-column
        prop="requestMethod"
        width="86"
        label="请求方式"
      />
      <el-table-column
        prop="resourceName"
        label="资源名称"
      />
      <el-table-column
        prop="resourceTypeName"
        width="90"
        label="资源类型"
        align="center"
      />
      <el-table-column
        prop="authCodeName"
        width="90"
        label="授权类型"
        align="center"
      />
      <el-table-column
        prop="environmentName"
        width="90"
        label="生效环境"
        align="center"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="90px"
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
            @change="setResourceStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
    </el-table>

    <ev-pagination
      :pager="pager"
      @query="query"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, onMounted} from 'vue'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import {Pagination} from '@utils/interface'
import {ResourceBeanVO, ResourceQuery} from './resourceModel'
import {scannerRrmResource, searchResourcePage, updateResourceStatus} from './resourceOption'
import {ElMessage} from 'element-plus'
import {Reading, Search} from '@element-plus/icons-vue'
import EvSelect from '../../../components/evcomp/ev-select.vue'

export default defineComponent({
  name: 'ResourceIndex',
  components: {EvSelect, EvPagination},
  setup() {
    
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
      status: null,
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
    
    const setResourceStatus = (id: string, status: number) => {
      updateResourceStatus(id, status).then(res => {
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
    
    const runScannerRrmResource = () => {
      scannerRrmResource().then(res => {
        if (res.code === 200) {
          query(1)
        }
      })
    }

    onMounted(() => {
      query(1)
    })
    
    return {
      Reading,
      Search,
      queryParams,
      pager,
      query,
      setResourceStatus,
      runScannerRrmResource,
    }
  },
})
</script>

<style scoped lang="scss">
  .resource-query-form-grid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
  }
</style>