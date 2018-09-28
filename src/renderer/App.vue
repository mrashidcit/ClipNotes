<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
  const { ipcRenderer } = require('electron')

  export default {
    name: 'briefnotes',
    methods: {
      // Generic SQL update
      // _sql: SQL command as string
      // _data: SQL data as array
      updateSqlEntry (_sql, _data) {
        // SEND 'onUPdateSqlEntry' to main process
        ipcRenderer.send('onUpdateSqlEntry', {
          sql: _sql,
          data: _data
        })
      },
      readSql (_obj) {
        ipcRenderer.send('onReadSql', _obj)
      },
      // Register Root events
      registerEvents () {
        const _context = this
        ipcRenderer.on('onSqlDataReady', (event, _obj) => {
          _context.$root.$emit('onSqlDataReady', _obj)
        })
        this.$root.$on('updateSqlEntry', (_obj) => {
          // Check _obj is valid
          if (_obj && _obj.constructor === {}.constructor) {
            if ('sql' in _obj && 'data' in _obj &&
              _obj.sql && _obj.data) {
              _context.updateSqlEntry(_obj.sql, _obj.data)
            }
          }
        })
        this.$root.$on('readSql', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor) {
            if ('sql' in _obj && 'id' in _obj &&
              _obj.sql && _obj.id) {
              _context.readSql(_obj)
            }
          }
        })
      }
    },
    mounted () {
      this.registerEvents()
    }
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
  .hero {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
