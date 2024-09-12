<template>
  <div class="error-page">
    <section>
      <h1>404</h1>
      <h3>哎呀，出了点问题。</h3>
      <p>抱歉！您访问的页面不存在。</p>
      <router-link
        to="/app/home/dashboard"
        class="to-app-home"
      >
        返回工作台
      </router-link>
    </section>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="scss">
.error-page{
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #F9FAFA;
}
  section {
    width: 240px;
    height: 280px;
    text-align: center;
    margin: auto;
    transform: translateY(calc((100vh - 300px) / 2));
    & h1{
      font-size: 6rem;
      color: var(--color-red);
    }
  }

  .to-app-home{
    display: inline-block;
    line-height: var(--size-default);
    padding: 0 var(--pd-small);
    border-radius: var(--border-radius-medium);
    margin-top: var(--mg-medium);
    font-weight: bolder;
    background-color: var(--color-red);
    text-decoration: none;
    color: #FFFFFF;
    &:hover{
      background-color: #fd5959;
    }
  }
</style>