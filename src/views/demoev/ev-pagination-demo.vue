<template>
  <div>
    <p>基于 Element Plus → Pagination 二次封装的分页插件。</p>

    <section>
      <h3>后端加载数据分页</h3>

      <el-table
        :data="pager.list"
        border
      >
        <el-table-column
          prop="name"
          label="name"
          width="180"
        />
        <el-table-column
          prop="date"
          label="date"
        />
      </el-table>

      <ev-pagination
        :pager="pager"
        @query="query"
      />
    </section>

    <section style="margin-top: 20px">
      <h3>前端加载数据分页</h3>

      <el-table
        ref="scrollTable"
        :data="pager2.list"
        border
      >
        <el-table-column
          prop="name"
          label="name"
          width="180"
        />
        <el-table-column
          prop="date"
          label="date"
        />
      </el-table>

      <ev-pagination
        :pager="pager2"
        @query="query2"
      />
    </section>

    <section style="margin-top: 20px">
      <h3>数据无限加载</h3>

      <el-table
        :data="pager3.list"
        border
      >
        <el-table-column
          prop="name"
          label="name"
          width="180"
        />
        <el-table-column
          prop="date"
          label="date"
        />
      </el-table>

      <div class="load-more">
        <el-button
          type="primary"
          :disabled="pager3.list.length === pager3.total"
          @click="query3(pager3.pageNum + 1)"
        >
          加载更多...
        </el-button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import EvPagination from '../../components/evcomp/ev-pagination.vue'
import {Pagination} from '@utils/interface'

export default defineComponent({
  name: 'EvPaginationDemo',
  components: {
    EvPagination,
  },
  setup () {
    const dataList = ref<Array<any>>([])

    // ================== 模拟数据===================== start ===
    const demoList: Array<any> = []
    for (let i = 0; i < 107; i++) {
      demoList.push({ name: `测试数据${i + 1}`, date: new Date().getTime() })
    }
    const demoData = (pageNum: number, pageSize: number) => {
      return {
        code: 200,
        message: null,
        data: {
          list: demoList.slice((pageNum - 1) * pageSize, pageNum * pageSize),
          total: 107,
          pageNum,
          pageSize,
        },
      }
    }
    const demoList2: Array<any> = []
    for (let i = 0; i < 527; i++) {
      demoList2.push({ name: `测试数据${i + 1}`, date: new Date().getTime() })
    }
    const demoData2 = () => {
      return {
        code: 200,
        message: null,
        data: demoList2,
      }
    }
    // ================== 模拟数据===================== end ===

    // ================== 后端分页===================== start ===
    const pager = reactive<Pagination<any>>({
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
      const data = demoData(pageNum, pageSize)
      if (data.code === 200) {
        pager.total = data.data.total
        pager.list = data.data.list
      }
    }
    // ================== 后端分页===================== end ===

    // ================== 前端分页===================== start ===
    const scrollTable = ref()
    const pager2 = reactive<Pagination<any>>({
      pageNum: 1,
      pageSize: 10,
      total: 0,
      list: [],
    })
    const query2 = (pageNum = pager2.pageNum, pageSize = pager2.pageSize) => {
      Object.assign(pager2, {
        pageNum,
        pageSize,
      })
      pager2.total = dataList.value.length
      pager2.list = dataList.value.slice((pageNum - 1) * pageSize, pageNum * pageSize)
      scrollTable.value.scrollTo(0, 0)
    }
    // ================== 前端分页===================== end ===

    // ================== 无限加载 ===================== start ===
    const pager3 = reactive<Pagination<any>>({
      pageNum: 1,
      pageSize: 10,
      total: 0,
      list: [],
    })
    const query3 = (pageNum = pager3.pageNum) => {
      Object.assign(pager3, {
        pageNum,
        total: dataList.value.length,
      })
      const temp = dataList.value.slice((pageNum - 1) * pager3.pageSize, pageNum * pager3.pageSize)
      if (pageNum === 1) {
        pager3.list = temp
        return
      }
      pager3.list =  pager3.list.concat(temp)
    }
    // ================== 无限加载 ===================== end ===

    // 加载测试数据
    const queryDataList = () => {
      const data = demoData2()
      if (data.code === 200) {
        dataList.value = data.data
        query2(1)
        query3(1)
      }
    }

    onMounted(() => {
      query(1)
      queryDataList()
    })

    return {
      pager,
      query,

      scrollTable,
      pager2,
      query2,

      pager3,
      query3,
    }
  },
})
</script>

<style scoped>
  section{
    margin-top: 20px;
  }
  .load-more{
    padding: var(--pd-large);
    text-align: center;
  }
</style>