<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <LinkCard
      v-for="project in projects"
      :key="project.href"
      v-bind="project"
    />
  </div>
</template>

<script setup lang="ts">
import LinkCard from './LinkCard.vue';

const projects = [
  {
    name: 'Interactive Data Explorer',
    icons: ['vi-file-type-vue', 'vi-file-type-typescript'],
    description: 'An interactive explorer for browsing and visualising scientific datasets.',
    href: '/projects/interactive-data-explorer',
  },
  {
    name: 'Interactive GLODAP Catalog',
    icons: ['vi-file-type-vue', 'vi-file-type-typescript'],
    description: 'An interactive catalog for exploring GLODAP ocean chemistry data.',
    href: '/projects/interactive-glodap-catalog',
  },
];
</script>
