<script setup lang="ts">
</script>

<template>
 <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Blog
      </h1>
      <p
        class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
      >
        At some point, I might write something interesting... Fingers crossed
        🤞.
      </p>
    <BlogItems />
    <slot />
    <NuxtPage/>
</template> 