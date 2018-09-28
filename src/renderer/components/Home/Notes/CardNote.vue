<template>
  <v-card flat tile height="250px" color="white"
    :class="`elevation-${elevation.value}`"
    @mouseover="onMouseOver(briefnotes)"
    @mouseout="onMouseOut(briefnotes)"
    style="cursor: pointer;">
    <v-img
      v-if="briefnotes.type === 'image'"
      height="250px"
      :src="briefnotes.filePath">
      <v-container fill-height fluid>
        <v-layout fill-height>
          <v-flex xs12 align-end flexbox>
            <p class="headline card-image-info">{{briefnotes.title}}</p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-img>
    <v-card-title v-else-if="briefnotes.type === 'text' || briefnotes.type === 'html'">
      <div class="headline">{{briefnotes.title}}</div>
    </v-card-title>
    <v-card-text v-if="briefnotes.type === 'text'">
      <span class="text-threedots">{{dummyDescription}}</span>
    </v-card-text>
    <v-card-text class="htmlContent" v-if="briefnotes.type === 'html'" v-html="dummyHtml"></v-card-text>
    <div class="options" v-if="onHover">
      <v-layout row>
        <v-btn icon raised color="white">
          <v-icon class="grey--text">star</v-icon>
        </v-btn>
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
    'briefnotes'
  ],
  data () {
    return {
      onHover: false,
      dummyDescription: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
      dummyTitle: `What is Lorem Ipsum?`,
      dummyHtml: `<h1>hello</h1> <h1>hello</h1> <h1>hello</h1><h1>hello</h1><h1>hello</h1>`,
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
  .card-image-info {
    background-color: rgba(255, 255, 255, 0.5);
    color: black;
    padding: 5px;
  }
  .htmlContent {
    overflow: hidden;
    height: 140px;
  }
</style>
