<template>
  <v-chip>
    {{tag.title}}
  </v-chip>
</template>

<script>
export default {
  name: 'tags',
  props: ['tag']
}
</script>
