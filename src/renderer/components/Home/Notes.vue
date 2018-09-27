<template>
  <div id="id-notes">
    <div class="wrapper">
      <v-container v-bind="{ [`grid-list-${size}`]: true }" fluid>
        <v-layout row wrap>
          <v-flex
            v-for="n in 9"
            :key="n"
            sm6 md4>
            <card-note :item="n" />
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import CardNote from './Notes/CardNote'
export default {
  name: 'notes',
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
