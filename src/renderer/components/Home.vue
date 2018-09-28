<template>
  <div>
    <!-- Top application bar -->
    <top-bar />
    <!-- Notes -->
    <notes :briefnote="briefnote" />
  </div>
</template>

<script>
  import TopBar from './Home/TopBar'
  import Notes from './Home/Notes'
  
  const path = require('path')
  const {
    ipcRenderer,
    clipboard
  } = require('electron')
  const uniqid = require('uniqid')

  export default {
    name: 'landing-page',
    components: {
      TopBar,
      Notes
    },
    data () {
      return {
        briefnote: [
          /* { title: 'A brief html note', type: 'html', path: '', id: '' },
          { title: 'A brief text note', type: 'text', path: '', id: '' },
          { title: 'A brief image note', type: 'image', path: 'https://images.pexels.com/photos/997719/pexels-photo-997719.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', id: '' } */
        ],
        uid: uniqid()
      }
    },
    methods: {
      addNote (_config) {
        if (_config && _config.constructor === {}.constructor &&
          'type' in _config && 'obj' in _config) {
          let resultObj = null
          switch (_config.type) {
            case 'text':
              if (_config.obj && _config.obj.constructor === {}.constructor &&
                'text' in _config.obj) {
                console.log(_config.obj.text)
              }
              break
            case 'html':
              if (_config.obj && _config.obj.constructor === {}.constructor &&
                'html' in _config.obj) {
                // Create result object
                const uid = uniqid()
                const fileName = `${uid}-${new Date().getTime()}.html`
                resultObj = {
                  title: 'Untitled Note',
                  type: 'html',
                  path: path.join(
                    'resource',
                    `${fileName}`
                  ),
                  id: uid
                }
                // Save file into app's resource folder
                this.$root.$emit('saveHtmlFile', {
                  html: _config.obj.html,
                  name: `${fileName}`
                })
              }
              break
            case 'image':
              if (_config.obj && _config.obj.constructor === {}.constructor &&
                'path' in _config.obj && 'format' in _config.obj) {
                // Create image file name
                const timestamp = new Date().getTime()
                const fileName =
                  path.basename(_config.obj.path).split('.').length > 1
                    ? `${path.basename(_config.obj.path).split('.')[0]}-${timestamp}.${path.basename(_config.obj.path).split('.')[1]}`
                    : `${path.basename(_config.obj.path)}-${timestamp}.${_config.obj.format}`
                // Create result object
                resultObj = {
                  title: path.basename(_config.obj.path).split('.').length > 1
                    ? path.basename(_config.obj.path).split('.')[0]
                    : path.basename(_config.obj.path),
                  type: 'image',
                  path: path.join(
                    'resource',
                    `${fileName}`
                  ),
                  id: uniqid()
                }
                // Save file into app's resource folder
                this.$root.$emit('saveImageFile', {
                  src: _config.obj.path,
                  name: `${fileName}`
                })
              }
              break
          }
          if (resultObj) {
            // Update object both local and SQL
            this.briefnote.push(resultObj)
            this.$root.$emit('updateSqlEntry', {
              sql: `INSERT INTO notes(title, type, path, id) VALUES(?,?,?,?)`,
              data: [
                resultObj.title,
                resultObj.type,
                resultObj.path,
                resultObj.id
              ]
            })
          }
        }
      },
      init () {
        this.$root.$emit('readSql', {
          sql: `SELECT * FROM notes`,
          id: this.uid
        })
      },
      registerEvents () {
        const context = this
        this.$root.$on('onSqlDataReady', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor &&
            'obj' in _obj && 'id' in _obj.obj) {
            if (_obj.obj.id === context.uid) {
              if (_obj.rows && _obj.rows.constructor === [].constructor) {
                _obj.rows.forEach((item) => {
                  context.briefnote.push(item)
                })
              }
            }
          }
        })
      }
    },
    mounted () {
      const context = this
      this.$nextTick(function () {
        context.registerEvents()
        context.init()
        ipcRenderer.on('onMenuItemClick', (event, arg) => {
          if (arg && arg.constructor === {}.constructor && 'label' in arg) {
            switch (arg.label) {
              case 'paste':
                const formats = clipboard.availableFormats()
                if (isImageFormat(formats)) {
                  const filePath = clipboard.read('public.file-url').replace('file://', '')
                  context.addNote({
                    type: 'image',
                    obj: {
                      path: filePath,
                      format: getImageFormat(formats)
                    }
                  })
                } else {
                  console.log('found text/html')
                  const htmlData = clipboard.readHTML()
                  context.addNote({
                    type: 'html',
                    obj: {
                      html: htmlData
                    }
                  })
                }
                break
              default: break
            }
          }
        })
      })
    }
  }

  function isImageFormat (_formats) {
    if (_formats.constructor === [].constructor) {
      for (let index = 0; index < _formats.length; index++) {
        const splitFormats = _formats[index].split('/')
        if (splitFormats.length > 0) {
          if (splitFormats[0] === 'image') {
            return true
          }
        }
      }
    }
    return false
  }

  function getImageFormat (_formats) {
    if (_formats.constructor === [].constructor) {
      for (let index = 0; index < _formats.length; index++) {
        const splitFormats = _formats[index].split('/')
        if (splitFormats.length > 0) {
          if (splitFormats[0] === 'image') {
            return splitFormats[1]
          }
        }
      }
    }
    return ''
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body {
    font-family: 'Lato', 'Source Sans Pro', sans-serif;
  }
</style>
