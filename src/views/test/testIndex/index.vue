<!--为没配置菜单的页面提供快速测试链接-->

<template>
  <ul>
    <li>
      <router-link to="/">首页</router-link>
    </li>
    <li>
      <router-link to="/user/center">个人中心</router-link>
    </li>
    <li>
      <router-link to="/test/jsmap">js版地图测试</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TestIndex'
}
</script>

<style scoped>

</style>
