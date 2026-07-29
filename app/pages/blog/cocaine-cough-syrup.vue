<script setup lang="ts">
const { data: post } = await useAsyncData(() =>
  queryCollection("content").path("/blog/cocaine-cough-syrup").first(),
);

useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
});
</script>

<template>
  <ContentRenderer v-if="post" :value="post" class="p-4 text-left" />
  <div v-else>Blog post not found</div>
</template>
