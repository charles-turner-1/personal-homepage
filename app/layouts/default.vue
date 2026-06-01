<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  { label: "Home", to: "/", active: route.path === "/" },
  {
    label: "About Me",
    to: "/about-me",
    active: route.path.startsWith("/about-me"),
  },
  {
    label: "Projects",
    to: "/projects",
    active: route.path.startsWith("/projects"),
  },
  { label: "Blog", to: "/blog", active: route.path.startsWith("/blog") },
  {
    label: "Contact",
    to: "/contact",
    active: route.path.startsWith("/contact"),
  },
]);
</script>
<!-- Default layout template.  -->
<template>
  <div>
    <UHeader :title="''">
      <UNavigationMenu :items="items" />
      <template #right>
        <div class="flex items-center gap-4">
          <GitCommit />
        </div>
      </template>
    </UHeader>
    <div class="bg-gray-50">
      <UMain>
        <div class="container text-center mx-auto px-6 py-6">
          <slot />
        </div>
      </UMain>
    </div>
  </div>
</template>
