<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
const { ipcRenderer } = require('electron')

export default {
  name: 'app',
  mounted () {
    const context = this
    this.$nextTick(function () {
      this.registerEvents()
      document.onpaste = function () {
        if (!context.$store.state.config.add.state) {
          console.log('onPaste')
          context.onPaste()
          context.$store.dispatch('setState', {
            name: 'add',
            state: true
          })
        }
      }
    })
  },
  methods: {
    registerEvents () {
      this.$root.$on('sql', function (config) {
        ipcRenderer.send('sql', config)
      })
    },
    onPaste () {
      console.log('on Paste')
    }
  }
}
</script>

<style>
  .wrapper {
    padding: 10px;
  }
  .hero-x {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .hero-x-y {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .state-view {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.452);
    z-index: 600;
    overflow-y: auto;
  }
  #app {
    position: fixed;
    top: 0; left: 0;
    bottom: 0; right: 0;
    background-color: #F7F7F7;
  }
  #app-sidebar {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    width: 300px;
    background-color: #FFFFFF;
    border-right-style: solid;
    border-right-color: #F9F9F9;
    border-right-width: 1px;
  }
  #app-sidebar > .sidebar-title {
    line-height: 50px;
  }
  .sidebar-title .logo {
    height: 30px;
    width: auto;
    padding: 0 10px;
    vertical-align: middle;
  }
  .sidebar-title .options {
    float: right;
  }
  #app-sidebar > .sidebar-info {
    background-color: rgba(60, 169, 113, 0.158);
    min-height: 120px;
  }
  .sidebar-info > .filter-count {
    margin: 0 0 0 15px;
    font-size: 30px;
    padding: 0;
  }
  #app-sidebar > .sidebar-tags {
    height: 200px;
    overflow-y: auto;
  }
  #app-content {
    position: fixed;
    left: 300px;
    top: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
