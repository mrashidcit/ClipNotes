<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
  export default {
    name: 'briefnote'
  }
</script>

<style>
  /* CSS */
  #app {
    background: #FFFFFF;
  }
  #id-top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    line-height: 50px;
    background-color: #F7F7F7;
  }
  #id-notes {
    position: fixed;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #FFFFFF;
    overflow: auto;
  }
  .wrapper {
    padding: 10px;
  }
  .wrapper[clear-top-bottom] {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
