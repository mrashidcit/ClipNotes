<template>
  <div id="id-top-bar">
    <div class="wrapper" clear-top-bottom>
      <div class="logo">
        briefnote
      </div>
      <div class="menu">
        <v-layout row id="topbar-searchview">
          <v-btn
            icon depressed :color="onViewSearch ? 'primary' : 'none'"
            @click="onClickViewSearch">
            <v-icon :class="`${onViewSearch ? 'white--text' : 'black--text'}`"> search </v-icon>
          </v-btn>
          <v-btn
            icon depressed>
            <v-icon>add_circle</v-icon>
          </v-btn>
        </v-layout>
      </div>
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
    onClickViewSearch () {
      this.$root.$emit('viewSearch', {
        state: this.onViewSearch ? 0 : 1
      })
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
