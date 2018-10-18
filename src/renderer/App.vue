<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
const { ipcRenderer, clipboard } = require('electron')

export default {
  name: 'app',
  mounted () {
    const context = this
    this.$nextTick(function () {
      this.registerEvents()
      this.init()
      document.onpaste = function () {
        if (!context.$store.state.config.add.state) {
          context.onPaste()
        }
      }
    })
  },
  methods: {
    registerEvents () {
      const context = this
      this.$root.$on('sql', function (config) {
        ipcRenderer.send('sql', config)
      })
      ipcRenderer.on('sql_read', function (event, config) {
        if (config && config.constructor === {}.constructor &&
          'for' in config && 'stage' in config && 'data' in config &&
          config.for && config.stage) {
          switch (config.stage) {
            case 'init':
              // For full initialization
              context.$store.dispatch('initEntries', {
                entry: config.for,
                source: config.data
              })
              break
            case 'singleEntry':
              // For single entry read
              break
            default: break
          }
        }
      })
    },
    init () {
      // Read notes form SQL
      this.$root.$emit('sql', {
        command: 'READ',
        sql: 'SELECT * FROM notes',
        data: null,
        for: 'notes',
        stage: 'init'
      })
      // Read filter from SQL
      this.$root.$emit('sql', {
        command: 'READ',
        sql: 'SELECT * FROM filter',
        data: null,
        for: 'filter',
        stage: 'init'
      })
      // Read tags from SQL
      this.$root.$emit('sql', {
        command: 'READ',
        sql: 'SELECT * FROM tags',
        data: null,
        for: 'tags',
        stage: 'init'
      })
    },
    onPaste () {
      this.$store.dispatch('setState', {
        name: 'add',
        state: true,
        data: clipboard.readText(),
        type: 'TEXT'
      })
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
  .editor-buttons-bar {
    line-height: 50px;
    background-color: #E7E7E7;
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
