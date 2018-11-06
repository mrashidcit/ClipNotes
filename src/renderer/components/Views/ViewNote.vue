<template>
  <transition name="fade">
    <div class="glass-view"
       v-if="$store.state.config.viewNote.state">
      <div id="note-view-image">
        <img :src="source" class="hero-x-y fit-image"
          v-if="'type' in $store.state.config.viewNote.data && $store.state.config.viewNote.data.type === 'IMAGE' && ready">
      </div>
      <div class="hero-x fit-text"
        v-if="'type' in $store.state.config.viewNote.data && $store.state.config.viewNote.data.type === 'TEXT' && ready"
        v-html="source"></div>
      <v-toolbar fixed color="transparent" flat>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn icon color="black"
            @click="closeNoteView">
            <v-icon class="white--text">close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </div>
  </transition>
</template>

<script>
import helper from '../../assets/helper.js'

export default {
  name: 'view-note',
  data () {
    return {
      source: null,
      ready: false
    }
  },
  computed: {
    viewNoteState: function () {
      return this.$store.state.config.viewNote.state
    }
  },
  watch: {
    viewNoteState: function (state) {
      if (state) {
        this.loadSource()
      }
    }
  },
  methods: {
    loadSource: function () {
      const src = helper.getPath(
        this.$store.state.config.viewNote.data,
        this.$store.state.config.resPath,
        this,
        true
      )
      this.source = src
      this.ready = true
    },
    closeNoteView () {
      this.$store.dispatch('setState', {
        name: 'viewNote',
        state: false
      })
      this.source = null
    }
  }
}
</script>

<style scoped>
  #note-view-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .fit-image {
    width: auto;
    height: 90%;
  }
  .fit-text {
    background: #FFFFFF;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 1px 1px 4px #888888;
    width: 70% !important;
  }
</style>
