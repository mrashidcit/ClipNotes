<template>
  <v-app id="app">
    <router-view :config="appConfig"></router-view>
  </v-app>
</template>

<script>
  const { ipcRenderer } = require('electron')

  const os = require('os')
  const path = require('path')
  const spawn = require('threads').spawn
  const fops = require('fs-extra')
  const base64Img = require('base64-img')

  export default {
    name: 'briefnotes',
    data () {
      return {
        appConfig: {
          dbPath: path.join(
            os.homedir(),
            '.xplorebits',
            'briefnote',
            'briefnote.db'
          ),
          appPath: path.join(
            os.homedir(),
            '.xplorebits',
            'briefnote'
          ),
          resourcePath: path.join(
            os.homedir(),
            '.xplorebits',
            'briefnote',
            'resource'
          )
        }
      }
    },
    methods: {
      // Generic SQL update
      // _sql: SQL command as string
      // _data: SQL data as array
      addSqlEntry (_sql, _data) {
        // SEND 'onAddSqlEntry' to main process
        ipcRenderer.send('onAddSqlEntry', {
          sql: _sql,
          data: _data
        })
      },
      updateSqlEntry (_sql) {
        // SEND 'onUpdateSqlEntry' to main process
        ipcRenderer.send('onUpdateSqlEntry', {
          sql: _sql
        })
      },
      readSql (_obj) {
        ipcRenderer.send('onReadSql', _obj)
      },
      deleteSqlEntryId (_obj) {
        ipcRenderer.send('onDeleteSqlEntryId', _obj)
      },
      // Register Root events
      registerEvents () {
        const _context = this
        ipcRenderer.on('onSqlDataReady', (event, _obj) => {
          _context.$root.$emit('onSqlDataReady', _obj)
        })
        this.$root.$on('addSqlEntry', (_obj) => {
          // Check _obj is valid
          if (_obj && _obj.constructor === {}.constructor) {
            if ('sql' in _obj && 'data' in _obj &&
              _obj.sql && _obj.data) {
              _context.addSqlEntry(_obj.sql, _obj.data)
            }
          }
        })
        this.$root.$on('updateSqlEntry', (_obj) => {
          // Check _obj is valid
          if (_obj && _obj.constructor === {}.constructor) {
            if ('sql' in _obj && _obj.sql) {
              _context.updateSqlEntry(_obj.sql)
            }
          }
        })
        this.$root.$on('deleteSqlEntryId', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor) {
            if ('sql' in _obj && _obj.sql) {
              _context.deleteSqlEntryId(_obj)
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
        this.$root.$on('saveHtmlFile', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor &&
            'html' in _obj && 'name' in _obj && 'obj' in _obj &&
            _obj.html && _obj.name) {
            if (!fops.existsSync(_context.appConfig.resourcePath)) {
              fops.ensureDirSync(_context.appConfig.resourcePath)
            }
            fops.writeFile(
              path.join(
                _context.appConfig.resourcePath,
                _obj.name.split('.').length > 1
                  ? _obj.name.split('.')[1] !== 'html'
                    ? `${_obj.name.split('.')[0]}.html`
                    : _obj.name
                  : `${_obj.name}.html`
              ),
              _obj.html,
              (err) => {
                if (err) {
                  console.error(err)
                } else {
                  _context.$root.$emit('onSaveNote', _obj.obj)
                }
              }
            )
          }
        })
        this.$root.$on('saveImageFile', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor &&
            'src' in _obj && 'name' in _obj && 'obj' in _obj &&
            _obj.src && _obj.name) {
            if (!fops.existsSync(_context.appConfig.resourcePath)) {
              fops.ensureDirSync(_context.appConfig.resourcePath)
            }
            if (fops.existsSync(_obj.src)) {
              fops.copyFile(
                _obj.src,
                path.join(
                  _context.appConfig.resourcePath,
                  _obj.name
                ),
                (err) => {
                  if (err) {
                    console.error(err)
                  } else {
                    this.createThumbnailAsync(_obj).then((_tPath) => {
                      _obj.obj['thumbnail'] = `resource/${_tPath}`
                      _context.$root.$emit('onSaveNote', _obj.obj)
                    })
                  }
                }
              )
            } else {
              console.error('File does not exists: ', _obj.src)
            }
          }
        })
        this.$root.$on('saveScreenshot', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor &&
            'data' in _obj && 'name' in _obj && 'obj' in _obj &&
            _obj.data && _obj.name) {
            if (!fops.existsSync(_context.appConfig.resourcePath)) {
              fops.ensureDirSync(_context.appConfig.resourcePath)
            }
            // Save image in file system
            base64Img.img(
              _obj.data,
              _context.appConfig.resourcePath,
              `${_obj.name}`,
              (err) => {
                if (err) {
                  console.error(err)
                } else {
                  _context.$root.$emit('onSaveNote', _obj.obj)
                }
              }
            )
          }
        })
      },
      // Create and Save Image as thumbnail
      async createThumbnailAsync (_obj) {
        const _context = this
        const promise = new Promise((resolve, reject) => {
          const thread = spawn(function (input, done) {
            // const base64Img = this.require('base64-img')
            const Jimp = this.require('jimp')
            const nodePath = this.require('path')
            const fsExtra = this.require('fs-extra')
            Jimp.read(input._srcPath, (err, lenna) => {
              if (err) throw err
              const _obj = lenna
                .resize(420, 254) // resize
                .quality(20)
              _obj.getBase64(Jimp.MIME_PNG, function (err, data) {
                if (err) {
                  done({name: null})
                } else {
                  const fileName = nodePath.basename(input._srcName.split('.')[0])
                  const thumbPath = nodePath.join(
                    input._resPath,
                    `.t-${fileName}`
                  )
                  fsExtra.writeFile(thumbPath, data, (err) => {
                    if (err) {
                      done({path: null})
                    } else {
                      done({path: `.t-${fileName}`})
                    }
                  })
                }
              })
            })
          })
          thread
            .send({
              _srcPath: _obj.src,
              _srcName: _obj.name,
              _resPath: _context.appConfig.resourcePath
            })
            // The handlers come here: (none of them is mandatory)
            .on('message', function (response) {
              console.log('xplore ->', response.path)
              resolve(response.path)
              thread.kill()
            })
            .on('error', function (error) {
              console.error('Worker errored:', error)
              reject(error)
            })
            .on('exit', function () {
              console.log('Worker has been terminated.')
            })
        })
        await promise
        return promise
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
  ::-webkit-scrollbar {
    width: 0;
    background: transparent
  }
  ::-webkit-scrollbar-thumb {
    background: transparent;
  }
  #search-view {
    position: fixed;
    top: 50px;
    left: 50%;
    width: 500px;
    transform: translateX(-50%);
    z-index: 400;
  }
  #id-top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    line-height: 50px;
    background-color: #F3F6F9;
    z-index: 1;
  }
  #id-notes {
    position: fixed;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #E8ECF2;
    overflow: auto;
    z-index: 1;
  }
  #id-notes::-webkit-scrollbar {
    width: 10px;
    background: transparent
  }
  #id-notes::-webkit-scrollbar-thumb {
    background: gray;
  }
  .hero {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .hero-x {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .view-card {
    background-color: rgba(255, 255, 255, 0.7);
    height: 100vh;
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
  [contenteditable]:focus {
    outline: 0px solid transparent;
  }
</style>
