<script setup lang="ts">
definePageMeta({
  title: "Home",
  layout: "default",
});

const { data: post } = await useAsyncData(() =>
  queryCollection("content").path("/home").first(),
);

useSeoMeta({
  title: "Charles Turner",
  description: post.value?.description,
});
</script>

<template>
  <ContentRenderer
    v-if="post"
    :value="post"
    class="prose dark:prose-invert max-w-3xl mx-auto"
  />

  <p
    class="text-gray-400 dark:text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed mt-4"
  >
    🔬 I'm testing
    <a
      href="https://posthog.com"
      target="_blank"
      rel="noopener noreferrer"
      class="underline hover:text-blue-500 transition-colors"
      >PostHog</a
    >
    analytics on this site. There are no ads — if you're running an ad blocker,
    I'd appreciate you whitelisting this domain and/or enabling javascript, so
    the data is meaningful.
  </p>
</template>
