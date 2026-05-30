<script setup lang="ts">
const { data: post } = await useAsyncData(() => queryCollection('content').path('/blog/virtualising-on-acacia').first())

useSeoMeta({
  title: post.value?.title,
  description: post.value?.description
})
</script>

<template>
  <ContentRenderer v-if="post" :value="post" />
  <div v-else>Blog post not found</div>
</template>
