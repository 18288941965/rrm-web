<template>
  <el-dialog
    v-model="visible"
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

    <div style="display: grid;grid-template-columns: 1200px 1fr">
      <el-table
        :data="pager.list"
        border
      >
        <el-table-column
          prop="serviceName"
          width="126"
          label="服务名称"
          fixed="left"
        >
          <template #header>
            <el-input
              v-model="queryParams.serviceName"
              clearable
              placeholder="服务名称"
              @keyup.enter="query(1)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="packageName"
          label="包名"
          width="260px"
        />
        <el-table-column
          prop="className"
          label="类名"
          width="200px"
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
          prop="resourceName"
          label=""
          width="200px"
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
          prop="resourceTypeName"
          width="126"
          label="资源类型"
          align="center"
        >
          <template #header>
            <ev-select
              v-model="queryParams.resourceType"
              dict-type="dic_res_type"
              :default-attr="{ label: 'entryName', value: 'entryCode' }"
              clearable
              placeholder="资源类型"
              @change="query(1)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="authCodeName"
          width="126"
          label="授权类型"
          align="center"
        >
          <template #header>
            <ev-select
              v-model="queryParams.authCode"
              dict-type="dic_res_auth_code"
              :default-attr="{ label: 'entryName', value: 'entryCode' }"
              clearable
              placeholder="授权类型"
              @change="query(1)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="environmentName"
          width="126"
          label="生效环境"
          align="center"
        >
          <template #header>
            <ev-select
              v-model="queryParams.environment"
              dict-type="dic_res_environment"
              :default-attr="{ label: 'entryName', value: 'entryCode' }"
              clearable
              placeholder="生效环境"
              @change="query(1)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="sel_"
          width="80px"
          align="center"
          label="选择"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              class="al-hover"
              @click="null"
            >
              <arrow-line />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div />
    </div>

    <ev-pagination
      :pager="pager"
      @query="query"
    />
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, watch} from 'vue'
import {dialogOptions} from '@utils/dialogOptions'
import {Pagination, PropPrams} from '@utils/interface'
import DialogHeader from '../../../components/dialog-header.vue'
import {ResourceBeanVO, ResourceQuery} from './resourceModel'
import {searchResourcePage} from './resourceOption'
import EvPagination from '../../../components/evcomp/ev-pagination.vue'
import EvSelect from '../../../components/evcomp/ev-select.vue'
import {ArrowLine} from '../../../components/svicon/publicIcon'

export default defineComponent({
  name: 'ResourceSelectDialog',
  components: {ArrowLine, EvSelect, EvPagination, DialogHeader},
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

    // 关闭窗口
    const handleClose = () => {
      const refresh = isRefresh.value
      isRefresh.value = false
      emit('close-dialog', refresh)
    }
    
    const handleOpen = () => {
      if (props.params.dataId) {
        query(1)
      }
    }

    return {
      visible,
      handleOpen,
      handleClose,

      queryParams,
      pager,
      query,
    }
  },
})
</script>

<style scoped lang="scss">

</style>