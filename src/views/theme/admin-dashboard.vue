<template>
  <div class="admin-dashboard">
    <div class="flow-bg">
      <img
        :src="dashboardBg"
        alt=" "
      >
    </div>

    <div class="count-grid">
      <div class="count-card color-1">
        <div class="icon">
          <component
            :is="'System'"
            :size="24"
          />
        </div>
        <div>
          <span class="title">项目数</span>
          <span class="count">1</span>
        </div>
      </div>
      <div class="count-card color-2">
        <div class="icon">
          <component
            :is="'Account'"
            :size="24"
          />
        </div>
        <div>
          <span class="title">平台账号数</span>
          <span class="count">1</span>
        </div>
      </div>
      <div class="count-card color-3">
        <div class="icon">
          <component
            :is="'Organization'"
            :size="24"
          />
        </div>
        <div>
          <span class="title">机构数</span>
          <span class="count">632</span>
        </div>
      </div>
      <div class="count-card color-4">
        <div class="icon">
          <component
            :is="'User'"
            :size="24"
          />
        </div>
        <div>
          <span class="title">用户数</span>
          <span class="count">15</span>
        </div>
      </div>

      <div class="count-card color-5">
        <div class="icon">
          <component
            :is="'Dict'"
            :size="24"
          />
        </div>
        <div>
          <span class="title">字典类型数</span>
          <span class="count">1</span>
        </div>
      </div>
      <div class="count-card color-5">
        <div class="icon">
          <component
            :is="'Dict'"
            :size="24"
          />
        </div>
        <div>
          <span class="title">字典项数</span>
          <span class="count">100</span>
        </div>
      </div>
      <div class="count-card color-6">
        <div class="icon">
          <component
            :is="'Apps'"
            :size="24"
          />
        </div>
        <div>
          <span class="title">菜单数</span>
          <span class="count">632</span>
        </div>
      </div>
      <div class="count-card color-6">
        <div class="icon">
          <component
            :is="'Apps'"
            :size="24"
          />
        </div>
        <div>
          <span class="title">菜单控件数</span>
          <span class="count">15</span>
        </div>
      </div>
    </div>

    <div class="count-grid count-grid2">
      <div class="charts-card">
        <canvas
          ref="chartCanvas4"
          height="300px"
        />
      </div>
      <div class="charts-card">
        <canvas
          ref="chartCanvas3"
          height="300px"
        />
      </div>
      <div class="charts-card">
        <canvas
          ref="chartCanvas"
          height="300px"
        />
      </div>
      <div class="charts-card">
        <canvas
          ref="chartCanvas2"
          height="300px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, onBeforeUnmount, nextTick} from 'vue'
import dashboardBg from '@assets/image/dashboard-bg.svg'
import Chart from 'chart.js/auto'

export default defineComponent({
  name: 'AdminDashboard',
  setup() {
    const chartCanvas = ref()
    const chartCanvas2 = ref()
    const chartCanvas3 = ref()
    const chartCanvas4 = ref()

    let chartInstance: any = null
    let chartInstance2: any = null
    let chartInstance3: any = null
    let chartInstance4: any = null

    const initDoughnut = () => {
      chartInstance4 = new Chart(chartCanvas4.value, {
        type: 'doughnut',
        data: {
          labels: ['普通角色', '州市管理员', '超级管理员'],
          datasets: [
            {
              label: '',
              data: [65, 59, 80],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            },
            title: {
              display: true,
              text: '角色 类型',
            },
          },
        },
      })
    }

    const initPolarArea = () => {
      chartInstance3 = new Chart(chartCanvas3.value, {
        type: 'polarArea',
        data: {
          labels: ['POST', 'GET', 'PUT', 'DELETE'],
          datasets: [
            {
              label: '',
              data: [65, 59, 80, 81],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'left',
            },
            title: {
              display: true,
              text: '资源 请求方式',
            },
          },
        },
      })
    }

    const initLine = () => {
      chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
          labels: ['内部接口', '外部接口', '开放接口'],
          datasets: [
            {
              label: '',
              data: [65, 59, 80],
              borderColor: 'rgb(230,199,152)',
              backgroundColor: 'rgb(246,236,221)',
              borderWidth: 2,
              borderRadius: Number.MAX_VALUE,
              borderSkipped: false,
              barThickness: 20,
              maxBarThickness: 20,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              position: 'bottom',
            },
            title: {
              display: true,
              text: '资源 接口类型',
            },
          },
        },
      })
    }

    const initBar = () => {
      chartInstance2 = new Chart(chartCanvas2.value, {
        type: 'bar',
        data: {
          labels: ['all', 'dev', 'prod'],
          datasets: [
            {
              label: '',
              data: [65, 59, 80],
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              borderRadius: Number.MAX_VALUE,
              borderSkipped: false,
              barThickness: 20,
              maxBarThickness: 20,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              position: 'bottom',
            },
            title: {
              display: true,
              text: '资源 环境类型',
            },
          },
        },
      })
    }

    onMounted(() => {
      nextTick(() => {
        initLine()
        initBar()
        initPolarArea()
        initDoughnut()
      })
    })

    onBeforeUnmount(() => {
      // 销毁图表实例以释放资源
      if (chartInstance) {
        chartInstance.destroy()
      }
      if (chartInstance2) {
        chartInstance2.destroy()
      }
      if (chartInstance3) {
        chartInstance3.destroy()
      }
      if (chartInstance4) {
        chartInstance4.destroy()
      }
    })
    
    return {
      dashboardBg,
      chartCanvas,
      chartCanvas2,
      chartCanvas3,
      chartCanvas4,
    }
  },
})
</script>

<style scoped lang="scss">
.admin-dashboard {
  margin: 0 !important;

  & .count-grid{
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 20px;
    margin: calc(var(--mg-large) * 2) var(--mg-large);
  }
  & .count-grid2{
    grid-template-columns: 320px 320px 1fr 1fr;
  }
  & .count-card{
    display: grid;
    grid-template-columns: var(--size-medium) 1fr;
    grid-gap: 10px;
    padding: var(--pd-medium);
    border-radius: var(--border-radius-large);
    background-color: var(--bg-color-header);
    box-shadow: var(--box-shadow-small);
    border-bottom: 2px solid;
    & .icon{
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--size-medium);
      height: var(--size-medium);
      border-radius: var(--border-radius-medium);
    }
    & span{
      display: block;
    }
    & .title{
      font-size: var(--h6-size);
    }
    & .count{
      font-weight: bolder;
      font-size: var(--h4-size);
    }
  }

  .color-1{
    border-bottom-color: #E2DFF8;
    & .icon{
      background-color: #E2DFF8;
      color: #8F84F2;
    }
    & .count{
      color: #8F84F2;
    }
  }
  .color-2{
    border-bottom-color: #D0EDF3;
    & .icon{
      background-color: #D0EDF3;
      color: #05BBD2;
    }
    & .count{
      color: #05BBD2;
    }
  }
  .color-3{
    border-bottom-color: #F9E8DD;
    & .icon{
      background-color: #F9E8DD;
      color: #FEA047;
    }
    & .count{
      color: #FEA047;
    }
  }
  .color-4{
    border-bottom-color: #D6EFE4;
    & .icon{
      background-color: #D6EFE4;
      color: #6DD29D;
    }
    & .count{
      color: #6DD29D;
    }
  }
  .color-5{
    border-bottom-color: #F2D6D7;
    & .icon{
      background-color: #F2D6D7;
      color: #FF4C51;
    }
    & .count{
      color: #FF4C51;
    }
  }
  .color-6{
    border-bottom-color: #EAEBED;
    & .icon{
      background-color: #EAEBED;
      color: #7F8390;
    }
    & .count{
      color: #7F8390;
    }
  }

  & .charts-card{
    width: 100%;
    height: 300px;
    border: var(--border-1);
    padding: 0 var(--pd-medium);
    box-shadow: var(--box-shadow-small);
    border-radius: var(--border-radius-large);
    & canvas{
      width: 100%;
    }
  }
}
.flow-bg{
  height: 292px;
  padding: var(--pd-medium) var(--pd-small);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.2' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  border-bottom: var(--border-1);
  & img{
    height: 100%;
    max-width: 100%;
  }
}
</style>