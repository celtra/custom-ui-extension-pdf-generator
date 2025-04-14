<template>
  <v-alert
    :title="title"
    :text="message"
    type="error"
    :icon="false"
  />
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()

</script>
