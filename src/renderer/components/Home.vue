<template>
  <div id="id-home" @click="resetTopbar">
    <!-- Top application bar -->
    <top-bar :onViewSearch="onViewSearch"
      :style="onViewNote ? `filter: blur(8px);-webkit-filter: blur(8px);` : null"/>
    <!-- Search View -->
    <search :onViewSearch="onViewSearch" :tags="tags" />
    <!-- Notes -->
    <notes v-if="!onLoading" :briefnote="briefnote"
      :style="onViewNote ? `filter: blur(8px);-webkit-filter: blur(8px);`: null"/>
    <!-- View Note -->
    <view-note :state="onViewNote" :data="noteViewData" :config="config" />
    <!-- Dialogs -->
    <!-- Generic Loader -->
    <generic-loader :config="dialogs.genericLoader" />
  </div>
</template>

<script>
  import TopBar from './Home/TopBar'
  import Notes from './Home/Notes'
  import Search from './Home/Search'
  import ViewNote from './Home/ViewNote'
  import GenericLoader from './Dialogs/GenericLoader'
  import { nativeImage } from 'electron'
  
  const os = require('os')
  const path = require('path')
  const {
    ipcRenderer,
    clipboard
  } = require('electron')
  const uniqid = require('uniqid')

  /**
   * Add platform specific dependencies
   */
  switch (os.platform()) {
    case 'win32':
      // Add if any windows specifc dependencies
      // Windows specifc packages can be listed in package.json -> "win32Dependencies" key
      try {
        window.winClipboard = require('win-clipboard')
      } catch (e) {
        console.error('win-clipboard not loaded')
      }
      break
    case 'linux':
      break
    case 'darwin':
      break
    default: break
  }

  export default {
    name: 'landing-page',
    components: {
      TopBar,
      Notes,
      ViewNote,
      GenericLoader,
      Search
    },
    props: ['config'],
    data () {
      return {
        onLoading: true,
        briefnote: [
          /* { title: 'A brief html note', type: 'html', path: '', id: '' },
          { title: 'A brief text note', type: 'text', path: '', id: '' },
          { title: 'A brief image note', type: 'image', path: 'https://images.pexels.com/photos/997719/pexels-photo-997719.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', id: '' } */
        ],
        tags: [],
        uid: uniqid(),
        dialogs: {
          genericLoader: {
            text: '',
            state: false
          }
        },
        onViewSearch: false,
        onViewNote: false,
        noteViewData: null
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
                  id: uid,
                  visible: false
                }
                // Save file into app's resource folder
                this.$root.$emit('saveHtmlFile', {
                  html: _config.obj.html,
                  name: `${fileName}`,
                  obj: resultObj
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
                  id: uniqid(),
                  visible: false
                }
                // Save file into app's resource folder
                this.$root.$emit('saveImageFile', {
                  src: _config.obj.path,
                  name: `${fileName}`,
                  obj: resultObj
                })
              }
              break
            case 'screenshot':
              if (_config.obj && _config.obj.constructor === {}.constructor &&
                'data' in _config.obj) {
                const timestamp = new Date().getTime()
                const uid = uniqid()
                const fileName = `${uid}-${timestamp}`
                resultObj = {
                  title: 'Untitled Screenshot',
                  type: 'image',
                  path: path.join(
                    'resource',
                    `${fileName}.png`
                  ),
                  id: uid,
                  visible: false
                }
                // Save file into app's resource folder
                this.$root.$emit('saveScreenshot', {
                  data: _config.obj.data,
                  name: `${fileName}`,
                  obj: resultObj
                })
              }
              break
            default: break
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
            this.$root.$emit('updateSqlEntry', {
              sql: `INSERT INTO filter(note, tag) VALUES(?,?)`,
              data: [
                resultObj.id,
                'tag_unlisted'
              ]
            })
          }
        }
      },
      init () {
        // Update runtime data from SQL database
        // Update notes
        this.$root.$emit('readSql', {
          sql: `SELECT * FROM notes`,
          id: this.uid,
          selector: 'notes'
        })
        // Update tags
        this.$root.$emit('readSql', {
          sql: `SELECT * FROM tags`,
          id: this.uid,
          selector: 'tags'
        })
      },
      registerEvents () {
        const context = this
        this.$root.$on('onSqlDataReady', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor &&
            'rows' in _obj && 'obj' in _obj && 'id' in _obj.obj &&
            'selector' in _obj.obj) {
            if (_obj.obj.id === context.uid && _obj.rows && _obj.rows.constructor === [].constructor) {
              switch (_obj.obj.selector) {
                case 'notes':
                  _obj.rows.forEach((item) => {
                    item['visible'] = true
                    context.briefnote.push(item)
                  })
                  break
                case 'tags':
                  _obj.rows.forEach((item) => {
                    context.tags.push(item)
                  })
                  break
                default: break
              }
            }
          }
        })
        this.$root.$on('onSaveImage', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor &&
            'type' in _obj && 'title' in _obj && 'path' in _obj && 'id' in _obj) {
            const targetIndex = this.briefnote.findIndex(item => item.id === _obj.id)
            if (targetIndex > -1) {
              this.briefnote[targetIndex].visible = true
            }
          }
        })
        this.$root.$on('viewSearch', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor &&
            'state' in _obj) {
            if (_obj.state) {
              this.onViewSearch = true
            } else {
              this.onViewSearch = false
            }
          }
        })
        this.$root.$on('resetTopbar', () => {
          this.onViewSearch = false
        })
        this.$root.$on('closeNoteView', () => {
          this.onViewNote = false
          this.noteViewData = null
        })
        this.$root.$on('viewNote', (_obj) => {
          this.noteViewData = _obj
          this.onViewNote = true
        })
      },
      onPaste () {
        const formats = clipboard.availableFormats()
        console.log(formats)
        if (isImageFormat(formats)) {
          const filePath = clipboard.read('public.file-url').replace('file://', '')
          if (filePath) {
            this.addNote({
              type: 'image',
              obj: {
                path: filePath,
                format: getImageFormat(formats)
              }
            })
          } else { // A screenshot
            const nativeImageObj = nativeImage.createFromBuffer(clipboard.readImage().toPNG())
            this.addNote({
              type: 'screenshot',
              obj: {
                data: nativeImageObj.toDataURL()
              }
            })
          }
        } else {
          const htmlData = (clipboard.readHTML() || clipboard.readText())
          if (htmlData) {
            this.addNote({
              type: 'html',
              obj: {
                html: htmlData
              }
            })
          } else {
            // Using win-clipboard to fetch Image or Text data
            if (os.platform() === 'win32') {
              // Generate file path
              const clipboardData = window.winClipboard.getFormats()
              if (clipboardData.indexOf('FileNameW') > -1) {
                const rawPath = new TextDecoder('utf-8').decode(window.winClipboard.getData('FileNameW'))
                let filePath = ''
                rawPath.split('').forEach((letter) => {
                  if (!(letter.charCodeAt(0) === 0)) {
                    filePath += letter
                  }
                })
                if (filePath) {
                  // Add Image Note
                  this.addNote({
                    type: 'image',
                    obj: {
                      path: filePath,
                      format: getImageFormat(formats)
                    }
                  })
                }
              }
            }
          }
        }
      },
      resetTopbar (e) {
        if (window.jQuery(e.target).closest('#search-view').length < 1 &&
          window.jQuery(e.target).closest('#topbar-searchview').length < 1) {
          this.$root.$emit('resetTopbar')
        }
      }
    },
    mounted () {
      const context = this
      this.onLoading = true
      this.dialogs.genericLoader.state = true
      this.$nextTick(function () {
        context.registerEvents()
        context.init()
        setTimeout(() => {
          context.dialogs.genericLoader.state = false
          context.onLoading = false
        }, 1000)
        if (os.platform() === 'win32') {
          document.onpaste = function () {
            context.onPaste()
          }
        }
        ipcRenderer.on('onMenuItemClick', (event, arg) => {
          if (arg && arg.constructor === {}.constructor && 'label' in arg) {
            switch (arg.label) {
              case 'paste':
                context.onPaste()
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
