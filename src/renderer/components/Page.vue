<template>
  <transition name="fade">
    <div id="app-content" @scroll="onScrollPage">
      <div class="wrapper">
        <v-layout row wrap>
          <v-flex
            v-for="
              (note, index) in 
              ($store.state.notes.selected.length > 0) 
              ? $store.state.notes.selected
              : $store.state.notes.notes"
            :key="note.id"
            xs6>
            <clip-note :note="note" v-if="index < $store.state.config.nextPageIndex"/>
          </v-flex>
        </v-layout>
      </div>
      <div style="height: 60px"
        v-if="$store.state.config.nextPageIndexLoader">
        <div class="hero-x" style="margin: 10px 0;">
          <v-progress-circular
            :size="40"
            :width="4"
            color="primary"
            indeterminate>
          </v-progress-circular>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ClipNote from './ClipNote'

export default {
  name: 'page',
  components: {
    ClipNote
  },
  data () {
    return {
      source: ``
    }
  },
  methods: {
    onScrollPage () {
      if (!this.$store.state.config.nextPageIndexLoader) {
        const pageEle = document.getElementById('app-content')
        if (
          (pageEle.scrollHeight - pageEle.scrollTop === pageEle.clientHeight) &&
          this.$store.state.config.nextPageIndex < this.$store.state.notes.notes.length
        ) {
          console.log('hit bottom')
          const context = this
          this.$store.dispatch('setState', {
            name: 'nextPageIndexLoader',
            state: true
          })
          setTimeout(function () {
            context.$store.dispatch('setState', {
              name: 'nextPageIndex'
            })
          }, 0)
        }
      }
    }
  }
}
</script>

<style scoped>
  ::-webkit-scrollbar {
    width: 10px;
    background: transparent
  }
  ::-webkit-scrollbar-thumb {
    background: #90908F;
  }
</style>

