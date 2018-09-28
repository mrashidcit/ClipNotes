<template>
  <div>
    <!-- Top application bar -->
    <top-bar />
    <!-- Notes -->
    <notes :briefnotes="briefnotes" />
  </div>
</template>

<script>
  import TopBar from './Home/TopBar'
  import Notes from './Home/Notes'
  
  const {
    ipcRenderer,
    clipboard
  } = require('electron')

  export default {
    name: 'landing-page',
    components: {
      TopBar,
      Notes
    },
    data () {
      return {
        briefnotes: [
          /* { title: 'A brief html note', type: 'html', path: '', id: '' },
          { title: 'A brief text note', type: 'text', path: '', id: '' },
          { title: 'A brief image note', type: 'image', path: 'https://images.pexels.com/photos/997719/pexels-photo-997719.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', id: '' } */
        ]
      }
    },
    methods: {
    },
    mounted () {
      // const context = this
      ipcRenderer.on('onMenuItemClick', (event, arg) => {
        if (arg && arg.constructor === {}.constructor && 'label' in arg) {
          switch (arg.label) {
            case 'paste':
              if (isImageFormat(clipboard.availableFormats())) {
                console.log('found image')
                const filePath = clipboard.read('public.file-url').replace('file://', '')
                console.log(filePath)
              } else {
                console.log('found text/html')
              }
              break
            default: break
          }
        }
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
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body {
    font-family: 'Lato', 'Source Sans Pro', sans-serif;
  }
</style>
