<template>
  <div id="id-notes">
    <!-- Notes as flex view -->
    <div class="wrapper"
      v-if="briefnote.length > 0">
      <v-layout>
        <v-container v-bind="{ [`grid-list-${size}`]: true }" fluid>
          <v-layout row wrap>
            <v-flex
              v-for="(item, index) in briefnote"
              :key="index"
              sm6 md4>
              <card-note :briefnote="item" :config="config" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </div>
    <!-- Instructions when notes are empty -->
    <div class="hero" v-else>
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
    'briefnote',
    'config'
  ],
  components: {
    CardNote
  },
  data () {
    return {
      size: 'md' // Editable grid list size
    }
  }
}
</script>
