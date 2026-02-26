<template>
  <div class="container mx-auto mt-10 px-6 py-12">
  
  <p class="text-3xl mt-6 mb-4">Scientific papers I've been involved in (or wrote)</p>
    <Publications/>
  <p class="text-3xl mt-6 mb-4">Half finished software tools I've created</p>
    <MyGithubRepos/>
  </div>


</template>

<script setup lang="ts">
import Publications from "./Publications.vue";
import MyGithubRepos from "./MyGithubRepos.vue";
</script>
