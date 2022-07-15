<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: 'App'
    }
  }
}
</script>
<!-- // 移动端适配
// 1. rem动态
//   - amfe-flexible
//   - 不管处于什么分辨率, 1rem始终是 1/10视口大小

// 2. 将px  rem
//  - postcss-pxtorem
//  - vant官网
//  - 版本是5.1.1 -->
<style lang="less"></style>
