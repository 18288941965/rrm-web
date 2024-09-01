<template>
  <div>
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
        width="90"
        label="请求方式"
      />
      <el-table-column
        prop="resourceName"
        label="资源名称"
      />
      <el-table-column
        prop="resourceType"
        width="90"
        label="资源类型"
      />
      <el-table-column
        prop="authCode"
        width="90"
        label="授权码"
      />
      <el-table-column
        prop="environment"
        width="90"
        label="环境"
      />
      <el-table-column
        prop="status"
        label="状态"
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
import {ResourceBean, ResourceQuery} from './resourceModel'
import {searchResourcePage, updateResourceStatus} from './resourceOption'
import {ElMessage} from 'element-plus'

export default defineComponent({
  name: 'ResourceIndex',
  components: {EvPagination},
  setup(props, ctx) {
    
    const queryParams = reactive<ResourceQuery>({
      serviceName: '',
      className: '',
      resourceName: '',
    })

    const pager = reactive<Pagination<ResourceBean>>({
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

    onMounted(() => {
      query(1)
    })
    return {
      queryParams,
      pager,
      query,
      setResourceStatus,
    }
  },
})
</script>

<style scoped lang="scss">

</style>