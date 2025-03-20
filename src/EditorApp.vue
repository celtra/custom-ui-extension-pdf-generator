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
  thumbUrl: 'https://cache-ssl.celtra.io/api/blobs/b6c7e1ee72ec2f0c9b74769ca63e4d179db2bad0c0ef195158bfafbc31069722/example1.png',
  url: 'https://cache-ssl.celtra.io/api/blobs/b6c7e1ee72ec2f0c9b74769ca63e4d179db2bad0c0ef195158bfafbc31069722/example1.png',
  name: 'Example1.png',
}

const example2 = {
  thumbUrl: 'https://cache-ssl.celtra.io/api/blobs/08462b4801c778ebd489114f969d168bfdfd35ab638dd63556990df7c49e584a/example2.svg',
  url: 'https://cache-ssl.celtra.io/api/blobs/08462b4801c778ebd489114f969d168bfdfd35ab638dd63556990df7c49e584a/example2.svg',
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
