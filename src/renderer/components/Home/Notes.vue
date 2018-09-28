<template>
  <div id="id-notes">
    <div class="wrapper">
      <v-container v-bind="{ [`grid-list-${size}`]: true }" fluid>
        <v-layout row wrap>
          <v-flex
            v-for="(item, index) in briefnotes"
            :key="index"
            sm6 md4>
            <card-note :briefnotes="item" />
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div class="hero">
      <p style="text-align: center; cursor: default;">
        No notes available!<br/>
        To get started, click <v-icon class="grey--text">add_circle</v-icon> to add new note
        or <b>copy and paste any item</b>.
      </p>
    </div>
  </div>
</template>

<script>
import CardNote from './Notes/CardNote'
export default {
  name: 'notes',
  props: [
    'briefnotes'
  ],
  components: {
    CardNote
  },
  data () {
    return {
      size: 'md',
      onViewOptions: false
    }
  }
}
</script>
