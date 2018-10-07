<template>
  <div id="id-top-bar">
    <div class="wrapper" clear-top-bottom>
      <!-- Topbar Logo -->
      <div class="logo">
        <img src="../../assets/logo.png">
        <span><b>briefnote</b></span>
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
          <!-- Button to add new note
          <v-btn @click="onClickNewNote"
            icon depressed>
            <v-icon>add_circle</v-icon>
          </v-btn> -->
        </v-layout>
      </div>
      <!-- Topbar options -->
      <div class="options">
        <v-layout row>
          <v-menu min-width="120"
            offset-y>
            <v-btn icon depressed
              slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile
                v-for="(item, index) in options"
                :key="index" @click="onClickOption(item.title)">
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
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
      menu: false,
      options: [
        { title: 'About' }
      ]
    }
  },
  methods: {
    /**
     * On click serach button.
     * Emits 'ViewSearch' event which is registerd in Home Component.
     */
    onClickViewSearch () {
      this.$root.$emit('viewSearch')
    },
    onClickNewNote () {
      this.$root.$emit('openDialog', {
        name: 'new-note'
      })
    },
    onClickOption (_title) {
      if (_title) {
        switch (_title) {
          case 'About':
            this.$root.$emit('aboutDialog')
            break
          default:
            break
        }
      }
    }
  }
}
</script>

<style scoped>
  .logo {
    float: left;
  }
  .logo > img {
    height: 30px;
    width: auto;
    display: inline-block;
    vertical-align: middle;
  }
  .logo > span {
    margin: 0 5px;
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
