<template>
  <div class="state-view"
    v-if="$store.state.config.add.state">
    <div class="wrapper hero-x"
      style="width: 600px">
      <v-layout row>
        <h1>{{ name || `New Note`}}</h1>
        <v-spacer></v-spacer>
        <v-btn icon color="red"
          @click="onCloseView">
          <v-icon class="white--text">clear</v-icon>
        </v-btn>
        <v-btn icon color="primary">
          <v-icon class="white--text">check</v-icon>
        </v-btn>
      </v-layout>
      <v-text-field box
        v-model="name"
        label="Note Name">
      </v-text-field>
      <v-textarea
        v-model="description"
        name="input-description"
        label="Note Description">
      </v-textarea>
      <v-combobox
        v-model="select" box
        :items="$store.state.notes.tags"
        label="Select Tags"
        multiple chips>
      </v-combobox>
      <v-img
        src="https://cdn.vuetifyjs.com/images/cards/desert.jpg">
      </v-img>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add',
  data () {
    return {
      select: [],
      name: '',
      description: ''
    }
  },
  methods: {
    onCloseView () {
      this.$store.dispatch('setState', {
        name: 'add',
        state: false
      })
    }
  }
}
</script>
