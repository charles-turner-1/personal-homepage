<script setup lang="ts">
const { data: post } = await useAsyncData(() =>
  queryCollection("content").path("/blog/raising-a-lobster").first(),
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
