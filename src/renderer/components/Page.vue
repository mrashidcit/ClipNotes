<template>
  <transition name="fade">
    <div id="app-content" @scroll="onScrollPage">
      <div class="wrapper">
        <v-layout row wrap
          v-if="$store.state.notes.selected.length > 0">
          <v-flex
            v-for="(note, index) in $store.state.notes.selected"
            :key="note.id"
            xs6>
            <clip-note :note="note" v-if="index < $store.state.config.nextPageIndex"/>
          </v-flex>
        </v-layout>
        <v-layout row wrap
          v-else>
          <v-flex
            v-for="(note, index) in notes"
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
      notes: [],
      modal: null
    }
  },
  computed: {
    onNotesChange () {
      return this.$store.state.notes.notes
    },
    onListReadyChange () {
      return this.$store.state.config.listReady
    },
    onListCountChange () {
      return this.$store.state.config.listCount
    }
  },
  watch: {
    onNotesChange () {
      this.notes = this.$store.state.notes.notes
    },
    onListReadyChange () {
      this.dummy()
    },
    onListCountChange () {
      console.log(this.$store.state.config.listCount)
      const countLimit = this.$store.state.notes.selected.length < 0
        ? this.$store.state.notes.notes.length
        : this.$store.state.notes.selected.length
      if (this.$store.state.config.listCount >= countLimit) {
        this.$store.dispatch('setState', {
          name: 'listReady',
          state: false
        })
      }
    }
  },
  mounted () {
    this.notes = this.$store.state.notes.notes
    this.dummy()
  },
  methods: {
    dummy () {
      if (this.$store.state.config.listReady) {
        this.$store.dispatch('setState', {
          name: 'loading',
          state: true
        })
      } else {
        setTimeout(() => {
          this.$store.dispatch('setState', {
            name: 'loading',
            state: false
          })
        }, 1000)
      }
    },
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

