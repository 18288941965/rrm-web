<template>
  <div class="admin-dashboard">
    <div class="flow-bg">
      <img
        :src="dashboardBg"
        alt=" "
      >
    </div>

    <div style="display: grid;grid-template-columns: 1fr 1fr 1fr 1fr;grid-gap: 20px;margin: 20px;">
      <div class="count-card">项目统计</div>
      <div class="count-card">机构统计</div>
      <div class="count-card">角色统计</div>
      <div class="count-card">用户统计</div>
    </div>

    <div style="display: grid;grid-template-columns: 1fr 1fr;grid-gap: 20px;margin: 20px;">
      <div class="charts-card">
        资源统计(授权类型)
      </div>
      <div class="charts-card">
        资源统计(请求方式)
      </div>
    </div>

    <div style="display: grid;grid-template-columns: 1fr 1fr;grid-gap: 20px;margin: 20px;">
      <div class="charts-card">
        菜单元素统计
      </div>
      <div class="charts-card">
        菜单统计
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import dashboardBg from '@assets/image/dashboard-bg.svg'

export default defineComponent({
  name: 'AdminDashboard',
  setup() {
    return {
      dashboardBg,
    }
  },
})
</script>

<style scoped lang="scss">
.admin-dashboard {
  margin: 0 !important;
  & .count-card{
    height: 60px;
    border: var(--border-1);
    box-shadow: var(--box-shadow-small);
    border-radius: var(--border-radius-medium);
  }
  & .charts-card{
    width: 100%;
    min-height: 200px;
    border: var(--border-1);
    box-shadow: var(--box-shadow-small);
    border-radius: var(--border-radius-medium);
  }
}
.flow-bg{
  height: 260px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.2' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  border-bottom: var(--border-1);
  & img{
    height: 100%;
    max-width: 100%;
  }
}
</style>