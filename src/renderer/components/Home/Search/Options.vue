<template>
  <option :value="tagItem.title">
    {{tagItem.value}}
  </option>
</template>

<script>
export default {
  name: 'options',
  props: ['tagItem']
}
</script>
