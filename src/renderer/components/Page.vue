<template>
  <div id="app-content">
    <div class="wrapper">
      <v-layout row wrap>
        <v-flex
          v-for="n in $store.state.notes.selected"
          :key="n"
          xs6>
          <v-card flat tile height="300px" style="margin: 10px;">
            <!-- <v-img
              :src="`https://unsplash.it/150/300?image=${Math.floor(Math.random() * 100) + 1}`"
              height="300px"
            ></v-img> -->
            <v-card-text v-html="source"></v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page',
  data () {
    return {
      source: ``
    }
  }
}
</script>