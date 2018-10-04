<template>
  <v-dialog id="id-view-note" v-model="state"
    fullscreen hide-overlay transition="dialog-bottom-transition"
    :load-source="data && 'path' in data ? prep(data) : null">
    <v-card class="view-card">
      <div class="menu wrapper">
        <v-layout row color="transparent">
          <h4 class="note-title">{{ title ? title : 'Untitled Note' }}</h4>
          <v-spacer></v-spacer>
          <v-btn @click="onCloseNoteView"
            icon color="white">
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </div>
      <div class="note" :small-image="data && data.type === 'image' ? isSmallImage() : null">
        <img v-if="data && data.type === 'image' && source"
          :src="source" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
const path = require('path')
const imageSize = require('image-size')

export default {
  name: 'view-note',
  props: ['state', 'data', 'config'],
  data () {
    return {
      title: '',
      object: '',
      source: null
    }
  },
  methods: {
    onCloseNoteView () {
      this.$root.$emit('closeNoteView')
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
    position: absolute;
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
  .note {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
  }
  .note[small-image] {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .note > img {
    width: 100%;
    height: auto;
  }
</style>
