<template>
  <transition name="fade">
    <div class="glass-view"
      v-if="$store.state.config.manageTags.state">
      <div class="wrapper hero-x"
        style="width: 600px">
        <v-layout row>
          <div>
            <h1>Manage Tags</h1>
            <p><strong>Add</strong> or <strong>Remove</strong> tags from clipnotes.</p>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon color="red"
            style="margin: 17px 0;"
            @click="onCloseView">
            <v-icon class="white--text">clear</v-icon>
          </v-btn>
        </v-layout>
        <v-text-field
          solo placeholder="Search Tags">
        </v-text-field>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    onCloseView: function () {
      this.$store.dispatch('setState', {
        name: 'manageTags',
        state: false
      })
    }
  }
}
</script>
