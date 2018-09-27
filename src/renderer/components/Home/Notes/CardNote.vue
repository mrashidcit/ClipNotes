<template>
  <v-card flat tile height="250px" color="white"
    :class="`elevation-${elevation.value}`"
    @mouseover="onMouseOver(item)"
    @mouseout="onMouseOut(item)">
    <v-card-title>
      <div class="headline">{{dummyTitle}}</div>
      <div class="text-threedots">{{dummyDescription}}</div>
    </v-card-title>
    <div class="options" v-if="onHover">
      <v-layout row>
        <v-btn icon raised color="white">
          <v-icon class="black--text">zoom_out_map</v-icon>
        </v-btn>
        <v-btn icon raised color="white">
          <v-icon class="black--text">edit</v-icon>
        </v-btn>
        <v-btn icon raised color="white">
          <v-icon class="black--text">more_horiz</v-icon>
        </v-btn>
      </v-layout>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'card-note',
  props: [
    'item'
  ],
  data () {
    return {
      onHover: false,
      dummyDescription: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
      dummyTitle: `What is Lorem Ipsum?`,
      elevation: {
        value: 0
      }
    }
  },
  methods: {
    onMouseOver (_item) {
      this.onHover = true
      this.elevation.value = 10
    },
    onMouseOut (_item) {
      this.onHover = false
      this.elevation.value = 0
    }
  }
}
</script>

<style scoped>
  .options {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 5px;
  }
  .text-threedots {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical; 
  }
</style>
