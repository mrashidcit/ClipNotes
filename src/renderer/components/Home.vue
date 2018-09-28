<template>
  <div>
    <!-- Top application bar -->
    <top-bar />
    <!-- Notes -->
    <notes :briefnotes="briefnotes" />
  </div>
</template>

<script>
  import TopBar from './Home/TopBar'
  import Notes from './Home/Notes'

  export default {
    name: 'landing-page',
    components: {
      TopBar,
      Notes
    },
    data () {
      return {
        briefnotes: [
          { title: 'A brief html note', type: 'html', filePath: '', id: '' },
          { title: 'A brief text note', type: 'text', filePath: '', id: '' },
          { title: 'A brief image note', type: 'image', filePath: 'https://images.pexels.com/photos/997719/pexels-photo-997719.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', id: '' }
        ]
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body {
    font-family: 'Lato', 'Source Sans Pro', sans-serif;
  }
</style>
