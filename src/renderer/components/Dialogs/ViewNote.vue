<template>
  <v-dialog id="id-view-note" v-model="state"
    fullscreen hide-overlay transition="dialog-bottom-transition"
    :load-source="data && 'path' in data ? prep(data) : null">
    <v-card class="view-card">
      <div class="menu wrapper">
        <v-layout row color="transparent">
          <h4 class="note-title">{{ data && data.title ? data.title : 'Untitled Note' }}</h4>
          <v-spacer></v-spacer>
          <v-btn @click="onInfo"
            icon color="white" :class="info ? 'primary': null">
            <v-icon>subject</v-icon>
          </v-btn>
          <v-btn
            icon color="white">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn @click="onCloseNoteView"
            icon color="white">
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </div>
      <div class="image-note" v-if="data && data.type === 'image' && source"
        :small-image="data && data.type === 'image' ? isSmallImage() : null">
        <img :src="source" />
      </div>
      <div class="text-note" v-if="data && (data.type === 'html' || data.type === 'text') && source">
        <div class="note" v-html="source" style="overflow: auto;"></div>
      </div>
      <div class="note-info"
        v-if="data && data.type === 'image' && info">
        <div class="wrapper">
          <h1>{{ data && data.title ? data.title : 'Untitled Note' }}</h1>
          <p>{{ data && data.description ? data.description : 'No Description provided' }}</p>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
const fops = require('fs-extra')
const path = require('path')
const imageSize = require('image-size')

export default {
  name: 'view-note',
  props: ['state', 'data', 'config'],
  data () {
    return {
      title: '',
      object: '',
      source: null,
      info: 1
    }
  },
  methods: {
    onCloseNoteView () {
      this.source = null
      this.$root.$emit('closeNoteView')
    },
    onInfo () {
      this.info = this.info ? 0 : 1
    },
    prep (_data) {
      if ('type' in _data && this.config && 'appPath' in this.config) {
        switch (_data.type) {
          case 'image':
            setTimeout(() => {
              this.source = `file://${
                path.join(
                  this.config.appPath,
                  _data.path
                )
              }`
            }, 100)
            break
          case 'text':
            this.loadFile(
              path.join(
                this.config.appPath,
                _data.path
              )
            )
            break
          case 'html':
            this.loadFile(
              path.join(
                this.config.appPath,
                _data.path
              )
            )
            break
          default: break
        }
      }
    },
    isSmallImage () {
      if (this.source) {
        const width = imageSize(this.source.split('file://')[1]).width
        if (width < 1000) {
          return true
        } else {
          return false
        }
      }
    },
    loadFile (_path) {
      if (_path && fops.existsSync(_path) && this.source == null) {
        console.log('readHtml')
        fops.readFile(_path, 'utf8', (err, data) => {
          if (err) {
            console.error(err)
          } else {
            this.source = data
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .view-card {
    background-color: rgba(255, 255, 255, 0.3);
    height: 100vh;
  }
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;
    background: transparent;
  }
  .menu .note-title {
    padding: 10px;
    margin: 5px 0;
    background: white;
  }
  .text-note {
    padding-top: 100px;
    background: transparent;
    width: 100%;
  }
  .text-note > .note {
    background: white;
    padding: 10px;
  }
  .image-note {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
  }
  .image-note[small-image] {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .image-note > img {
    width: 100%;
    height: auto;
  }
  .note-info {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 250px;
    background: rgba(255, 255, 255, 0.8)
  }
</style>
