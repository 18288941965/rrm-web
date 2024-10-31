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
        <el-form-item label="资源名称">
          <el-input
            v-model="queryParams.resourceName"
            clearable
            @keyup.enter="query(1)"
          />
        </el-form-item>
        
        <el-form-item label="资源类型">
          <ev-select
            v-model="queryParams.resourceType"
            dict-type="dic_res_type"
            :default-attr="{ label: 'entryName', value: 'entryCode' }"
            clearable
            @change="query(1)"
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
        <el-form-item label="类名">
          <el-input
            v-model="queryParams.className"
            clearable
            @keyup.enter="query(1)"
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

        <el-form-item label="生效环境">
          <ev-select
            v-model="queryParams.environment"
            dict-type="dic_res_environment"
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
      </div>
    </el-form>

    <el-button
      class="mgb-medium"
      type="success"
      :icon="Plus"
      @click="dialogEmptyOpen"
    >
      扫描资源
    </el-button>
    
    <el-table
      :data="pager.list"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="serviceName"
        width="100"
        label="服务名称"
      />
      <el-table-column
        prop="packageName"
        label="类信息"
      >
        <template #default="scope">
          <div class="text-color">
            {{ scope.row.packageName }}
          </div>
          {{ scope.row.className }}
        </template>
      </el-table-column>
      <el-table-column
        prop="methodName"
        label="方法信息"
      >
        <template #default="scope">
          <div class="text-color">
            {{ scope.row.methodName }}
          </div>
          {{ scope.row.requestPath }}
        </template>
      </el-table-column>

      <el-table-column
        prop="resourceName"
        label="资源信息"
        width="280"
      >
        <template #default="scope">
          <div class="text-color">
            {{ scope.row.resourceName }}
          </div>
          
          <el-tag
            round
            type="success"
          >
            {{ scope.row.authCodeName }}
          </el-tag>
          
          <el-tag
            round
            class="mgl-medium"
          >
            {{ scope.row.requestMethod }}
          </el-tag>

          <el-tag
            round
            class="mgl-medium"
            type="warning"
          >
            {{ scope.row.resourceTypeName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="environmentName"
        width="86"
        label="生效环境"
        align="center"
      />
      <el-table-column
        prop="createdAt"
        width="170"
        label="创建时间"
        align="center"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="80px"
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
    
    <resource-scan-dialog
      v-bind="dialogEmpty"
      @close-dialog="dialogEmptyCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, onMounted} from 'vue'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import {Pagination} from '@utils/interface'
import {ResourceBeanVO, ResourceQuery} from './resourceModel'
import {searchResourcePage, updateResourceStatus} from './resourceOption'
import {ElMessage} from 'element-plus'
import {Plus, Search} from '@element-plus/icons-vue'
import EvSelect from '../../../components/evcomp/ev-select.vue'
import {dialogEmptyContent} from '@utils/dialogOptions'
import ResourceScanDialog from './resource-scan-dialog.vue'

export default defineComponent({
  name: 'ResourceIndex',
  components: {
    EvSelect, 
    EvPagination,
    ResourceScanDialog,
  },
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
      pageSize: 5,
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
    
    const {
      dialogEmpty,
      dialogEmptyOpen,
      dialogEmptyCloseAndRefresh,
    } = dialogEmptyContent()

    onMounted(() => {
      query(1)
    })
    
    return {
      Plus,
      Search,
      queryParams,
      pager,
      query,
      setResourceStatus,

      dialogEmpty,
      dialogEmptyOpen,
      dialogEmptyCloseAndRefresh,
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
  .text-color{
    color: var(--text-color-placeholder);
    &:hover{
      color: var(--text-color-primary);
    }
  }
</style>