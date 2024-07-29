<template>
  <div class="admin-dashboard">
    <section>
      <h4>项目模块设计建议</h4>
      <ul class="dashboard-ul">
        <li>字典原则：字典选择采用组件化，可根据参数区分（部门、用户等优先考虑异步树）。选择结果禁止为了方便存储字典名称</li>
        <li>布局原则：页面布局既要紧凑又要留足够的空间，表格展示紧凑为主，列过多可考虑将语义一致的放在一列展示</li>
        <li>模块设计原则：找准中心展示数据，在衍生其他额外操作</li>
        <li>统一性原则：无权限模块、404路由等需要跳转到统一的页面进行说明</li>
        <li>灵动性原则：多个页面之间的多类数据可灵活跳转</li>
        <li>消息共享原则：多个标签页实现切换单位、退出登录、接受后端web socket等消息共享</li>
        <li>流程性原则：对于复杂且具有流程特性的模块，需要用流程图绘制，并可点击具体的节点到对应的模块</li>
        <li>环境变量原则：使用后端配置文件思想来处理有变化或通用的变量</li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'AdminDashboard',
  setup() {
    //
  },
})
</script>

<style scoped lang="scss">
.admin-dashboard {
  margin: 0 !important;
  padding: 20px;
  & .dashboard-ul{
    margin: 20px;
    line-height: 40px;
    list-style: circle;
  }
}
</style>