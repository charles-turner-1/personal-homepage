<template>
  <div class="flex flex-col gap-4">
    <RouterLink
      v-for="post in posts"
      :key="post.href"
      :to="post.href"
      class="flex flex-col gap-2 px-6 py-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div
        class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium"
      >
        {{ post.date }}
      </div>
      <div
        class="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug"
      >
        {{ post.title }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        {{ post.excerpt }}
      </div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
const posts = [
  {
    title:
      "Virtualising & Distributing Data through Acacia (Pawsey) & Nirin (NCI)",
    date: "April 2026",
    excerpt:
      "Playing around with virtualisation, data distribution and streaming with virtualizarr, icechunk, kerchunk.",
    href: "/blog/virtualising-on-acacia",
  },
];
</script>
