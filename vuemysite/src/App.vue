<template>
  <div id="app">

    <router-link class="btn btn-primary" to="/login/" role="button">登入</router-link>
    <router-link class="btn btn-secondary" to="/" role="button">首頁</router-link>

    <router-view></router-view>

  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    // const api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/products`;
    // this.$http.get(api).then((response) => {
    //   console.log(response.data)
    // });
  }
}
</script>

<style lang="scss">
  @import "./assets/all.scss";
</style>
