<template>
  <q-avatar
    :size="size"
    :font-size="size"
    color="grey-13"
    text-color="white"
    :icon="img.length === 0 ? 'account_circle' : null"
  >
    <img v-if="img.length > 0" :src="img">
  </q-avatar>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '150px'
    }
  }
}
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
