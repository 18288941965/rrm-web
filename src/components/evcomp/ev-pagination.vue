<template>
  <el-pagination
    v-model:current-page="page"
    v-model:page-size="size"
    background
    :page-sizes="pageSizes"
    layout="total, sizes, prev, pager, next"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script lang="ts">
import {ref, defineComponent, watch, PropType} from 'vue'
import {Pagination} from '@utils/interface'

const _pagination: Pagination<any> = {
  pageNum: 1,
  pageSize: 10,
  total: 0,
  list: [],
}

const _pageSizes = [5, 10,20,50,100,200]

export default defineComponent({
  name: 'EvPagination',
  props: {
    pageSizes: {
      type: Object as PropType<Array<number>>,
      default: _pageSizes,
    },
    pager: {
      type: Object as PropType<Pagination<any>>,
      default: _pagination,
      required: true,
    },
  },
  emits: ['query'],
  setup (props, { emit }) {
    const page = ref(1)
    const size = ref(10)
    const total = ref(0)

    // 监听传入参数
    watch(props.pager, (newValue) => {
      page.value = newValue.pageNum
      size.value = newValue.pageSize
      total.value = newValue.total
    })

    // 切换每页显示多少条
    const handleSizeChange = (val: number) => {
      if ((page.value - 1) * size.value  <= total.value ) {
        emit('query', page.value, val)
      }
    }

    // 翻页
    const handleCurrentChange = (val: number) => {
      if ((page.value - 1) * size.value  <= total.value ) {
        emit('query', val, size.value)
      }
    }

    return {
      page,
      size,
      total,
      handleSizeChange,
      handleCurrentChange,
    }
  },
})
</script>
