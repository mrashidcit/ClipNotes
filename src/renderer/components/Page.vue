<template>
  <div id="app-content">
    <div class="wrapper">
      <v-layout row wrap>
        <v-flex
          v-for="note in $store.state.notes.notes"
          :key="note.id"
          xs6>
          <clip-note :note="note"/>
        </v-flex>
      </v-layout>
    </div>
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
      source: ``
    }
  }
}
</script>