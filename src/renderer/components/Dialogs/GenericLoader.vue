<template>
  <v-dialog
      v-model="config.state"
      persistent
      width="300">
      <v-card
        color="primary"
        dark>
        <v-card-text>
          {{ config && 'text' in config && config.text ? config.text : `Please stand by` }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: 'generic-loader',
  props: [
    'config'
  ]
}
</script>
