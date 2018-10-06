<template>
  <div id="id-top-bar">
    <div class="wrapper" clear-top-bottom>
      <!-- Topbar Logo -->
      <div class="logo">
        briefnote
      </div>
      <!-- Topbar center menu -->
      <div class="menu">
        <v-layout row id="topbar-searchview">
          <!-- Button to search notes -->
          <v-btn
            icon depressed :color="onViewSearch ? 'primary' : 'none'"
            @click="onClickViewSearch">
            <v-icon :class="`${onViewSearch ? 'white--text' : 'black--text'}`"> search </v-icon>
          </v-btn>
          <!-- Button to add new note -->
          <v-btn
            icon depressed>
            <v-icon>add_circle</v-icon>
          </v-btn>
        </v-layout>
      </div>
      <!-- Topbar options -->
      <div class="options">
        <v-layout row>
          <v-btn icon depressed>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'top-bar',
  props: ['onViewSearch'],
  data () {
    return {
      menu: false
    }
  },
  methods: {
    /**
     * On click serach button.
     * Emits 'ViewSearch' event which is registerd in Home Component.
     */
    onClickViewSearch () {
      this.$root.$emit('viewSearch')
    }
  }
}
</script>

<style scoped>
  .logo {
    float: left;
  }
  .menu {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .options {
    float: right;
  }
  .wrap-in-single-line {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
