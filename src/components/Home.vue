<template>
  <div class="container mx-auto px-6 py-12">
    <div class="text-center mb-12 mt-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Hey, I'm Charles 👋
      </h1>
      <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
        This site has been slapped together with the help of Claude Sonnet, and is just a bit of an
        exposition for things I'm interested in. I figured that writing them up and hosting them
        somewhere might force me to make some progress with them.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
      <RouterLink
        v-for="page in pages"
        :key="page.to"
        :to="page.to"
        class="flex flex-col gap-2 px-6 py-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
      >
        <div class="flex items-center gap-2">
          <i :class="['pi', page.icon, 'text-gray-400 dark:text-gray-500']" />
          <span class="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ page.label }}
          </span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed m-0">{{ page.description }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

const pages = [
  {
    to: '/about',
    label: 'About Me',
    icon: 'pi-user',
    description: 'A bit about who I am, what I do, and what I care about.',
  },
  {
    to: '/projects',
    label: 'Projects',
    icon: 'pi-code',
    description: 'Half-finished software tools and publications I\'ve been involved in.',
  },
  {
    to: '/blog',
    label: 'Blog',
    icon: 'pi-pencil',
    description: 'Occasional write-ups on things I\'m working through or thinking about.',
  },
  {
    to: '/contact',
    label: 'Contact',
    icon: 'pi-envelope',
    description: 'Get in touch via GitHub, LinkedIn, or drop me a message directly.',
  },
];
</script>
