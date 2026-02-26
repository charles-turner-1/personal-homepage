<template>
  <div class="container mx-auto mt-10 px-6 py-12">
  
  <p class="text-3xl mt-6 mb-4">Papers I was involved in (or wrote)</p>
    <Publications/>
  <p class="text-3xl mt-6 mb-4">Half finished software tools I've created</p>
    <MyGithubRepos/>
  </div>


</template>

<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import Publications from "./Publications.vue";
import MyGithubRepos from "./MyGithubRepos.vue";
</script>
