<template>
  <div id="id-top-bar">
    <div class="wrapper" clear-top-bottom>
      <div class="logo">
        briefnote
      </div>
      <div class="menu">
        <v-layout row>
          <v-btn icon depressed>
            <v-icon>dashboard</v-icon>
          </v-btn>
          <v-btn icon depressed>
            <v-icon>star</v-icon>
          </v-btn>
          <v-btn icon depressed>
            <v-icon>search</v-icon>
          </v-btn>
        </v-layout>
      </div>
      <div class="options">
        <v-layout row>
          <v-btn icon depressed>
            <v-icon>filter_list</v-icon>
          </v-btn>
          <v-btn icon depressed>
            <v-icon>exit_to_app</v-icon>
          </v-btn>
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
  name: 'top-bar'
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
</style>
