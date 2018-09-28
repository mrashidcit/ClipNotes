<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
  export default {
    name: 'briefnotes'
  }
</script>

<style>
  /* CSS */
  #app {
    background: #F3F6F9;
    user-select: none;
    -webkit-user-drag: none;
  }
  #app::-webkit-scrollbar {
    width: 0px;
    background: transparent
  }
  #app::-webkit-scrollbar-thumb {
    background: transparent;
  }
  #id-top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    line-height: 50px;
    background-color: #F3F6F9;
  }
  #id-notes {
    position: fixed;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #E8ECF2;
    overflow: auto;
  }
  .wrapper {
    padding: 10px;
  }
  .wrapper[clear-top-bottom] {
    padding-top: 0;
    padding-bottom: 0;
  }
  .text-threedots {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical; 
  }
</style>
