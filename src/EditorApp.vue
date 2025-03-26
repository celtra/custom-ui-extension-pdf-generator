<template>
  <div class="extension-main-container">
    Drag and drop file to canvas or feed.
    <div class="images-container">
      <draggable-file :drag-and-drop-payload="example1" />
      <draggable-file :drag-and-drop-payload="example2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DraggableFile from './editor/DraggableFile.vue'

const example1 = {
  thumbUrl: 'https://files-cdn.celtra.com/extensions-examples/example1.png',
  url: 'https://files-cdn.celtra.com/extensions-examples/example1.png',
  name: 'Example1.png',
}

const example2 = {
  thumbUrl: 'https://files-cdn.celtra.com/extensions-examples/example2.svg',
  url: 'https://files-cdn.celtra.com/extensions-examples/example2.svg',
  name: 'Example2.svg',
}
</script>

<style scoped>
.extension-main-container {
  padding: 16px;
  height: 100vh;
}

.images-container {
  display: flex;
  gap: 16px;
}
</style>
