<template>
  <div class="container mx-auto px-6 py-16">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Get in touch</h1>
      <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Whether it's a project, a question, or just to say hi — feel free to reach out.</p>
    </div>
    <div class="flex justify-center gap-6">
      <ContactCard
        href="https://www.github.com/charles-turner-1"
        icon="bi-github"
        platform="GitHub"
        label="Hit me up on Github"
        icon-class="text-gray-800 dark:text-white"
      />
      <ContactCard
        href="https://www.linkedin.com/in/charles-turner-6b9794150/"
        icon="bi-linkedin"
        platform="LinkedIn"
        label="Connect on LinkedIn"
        icon-class="text-[#0A66C2]"
      />
      <ContactCard
        href="https://forum.access-hive.org.au/u/charlesturner/"
        :img="hiveIcon"
        platform="Hive-Forum"
        label="ACCESS-Hive Forum"
      />
      
    </div>

    <div class="flex items-center gap-4 my-10 max-w-lg mx-auto">
      <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      <span class="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">or send a message</span>
      <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </div>

    <ContactForm />
  </div>
</template>

<script setup lang="ts">
  import ContactCard from './ContactCard.vue';
  import ContactForm from './ContactForm.vue';
  import hiveIcon from '../assets/hive.png';
</script>
