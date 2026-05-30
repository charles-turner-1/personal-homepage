<script setup lang="ts">

import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  { label: 'Home', to: '/' , active: route.path === ('/') },
  { label: 'About Me', to: '/aboutme', active: route.path.startsWith('/aboutme') },
  { label: 'Projects', to: '/projects', active: route.path.startsWith('/projects') },
  { label: 'Blog', to: '/interactive-glodap-catalog', active: route.path.startsWith('/interactive-glodap-catalog') },
  { label: 'Contact', to: '/contact', active: route.path.startsWith('/contact') },
]);

definePageMeta({
  title: 'Home',
  layout: 'default',
})
</script>

<template>
  <div class="text-2xl text-center mt-8">
    Home page
  </div>
</template>