<template>
  <div id="app-content">
    <transition name="fade">
      <div @scroll="onScrollPage">
        <div class="wrapper">
          <v-layout row wrap>
            <v-flex
              v-for="(note, index) in ($store.state.notes.selected.length > 0 ||
              $store.state.config.tagSelection.length > 0)
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
    <transition name="fade">
      <div class="hero-x-y" style="text-align: center;"
        v-if="$store.state.notes.notes.length < 1">
        <img class="img-indicator"
          src="../assets/indicators/empty_notes.png">
        <h1 class="text-secondary text-light-weight">
          Your notes collection is empty!
        </h1>
        <p>Copy Text or Image from anywhere and paste it here.</p>
        <p>
          To Paste something, <br/>
          Press <strong>{{ platformOS !== 'darwin' ? `CTRL+V` : `&#8984;+V`}}</strong> |
          Click <v-icon class="primary--text">assignment_returned</v-icon> button, in the sidebar |<br/>
          Go to <strong>Edit</strong> &#8608; <strong>Paste</strong>
        </p>
      </div>
       <div class="hero-x-y" style="text-align: center"
        v-else-if="
          $store.state.notes.selected.length < 1 &&
          $store.state.config.tagSelection.length > 0
        ">
          <img class="img-indicator"
            src="../assets/indicators/empty_collection.png">
          <h1 class="text-secondary text-light-weight">
            No Notes Found!
          </h1>
          <p>There are no notes available for selected tags.</p>
          <div v-if="$store.state.config.strictFilter.state">
            <h2 class="text-primary">
              Hard Filter Enabled!
            </h2>
            <div class="important-info-box">
              <p>Warning: ClipNotes will filter notes for the <strong> exact combination of selected tags</strong>.</p>
            </div>
          </div>
       </div>
    </transition>
  </div>
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
      platformOS: process.platform
    }
  },
  mounted () {
    this.notes = this.$store.state.notes.notes
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
  .img-indicator {
    display: block;
    margin: auto;
    height: auto;
    width: 120px;
    opacity: 0.8;
  }
</style>

