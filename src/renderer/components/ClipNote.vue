<template>
  <v-card flat tile height="300px" style="margin: 10px;">
    <v-img
      v-if="note.type === 'IMAGE' && source"
      :src="`${source}`"
      height="300px"
    ></v-img>
    <v-card-text
      v-if="note.type === 'TEXT' && source"
      class="text-threedots"
      v-html="`${source}`">
    </v-card-text>
    <div class="hero-x-y"
      v-if="!source"
      :load-source="getSource(note)">
      <v-progress-circular
        :size="100"
        :width="4"
        color="primary"
        indeterminate>
      </v-progress-circular>
    </div>
  </v-card>
</template>

<script>
const fops = require('fs-extra')
const path = require('path')

export default {
  name: 'clip-note',
  props: [
    'note'
  ],
  data () {
    return {
      source: ''
    }
  },
  methods: {
    getSource (note) {
      if (
        note && note.constructor === {}.constructor &&
        'type' in note && note.type
      ) {
        const context = this
        if (!this.$store.state.config.resPath) {
          this.$store.dispatch('setState', {
            name: 'resPath',
            data: require('../assets/defConfig').refPath
          })
        }
        switch (note.type) {
          case 'TEXT':
            fops.readFile(
              path.join(
                this.$store.state.config.resPath,
                note.path
              ),
              'utf-8',
              function (err, data) {
                if (err) {
                  console.error(err)
                } else {
                  context.source = data
                }
              }
            )
            break
          case 'IMAGE':
            fops.readFile(
              path.join(
                this.$store.state.config.resPath,
                note.thumbnail
              ),
              'utf-8',
              function (err, data) {
                if (err) {
                  console.error(err)
                } else {
                  context.source = data
                }
              }
            )
            break
          default: break
        }
      }
    }
  }
}
</script>

