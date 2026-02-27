<template>
  <div class="container mx-auto mt-10 p-6">
    <RouterLink
      to="/projects"
      class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors my-4"
    >
      <v-icon name="hi-arrow-left" scale="0.9" />
      Back to Projects
    </RouterLink>
    <p class="text-3xl mt-6 mb-4">Interactive Data Explorer</p>
    <p class="text-gray-500 dark:text-gray-400">Coming soon.</p>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
