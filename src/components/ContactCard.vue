<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="flex flex-col items-center justify-center gap-3 w-40 h-40 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-gray-700 dark:text-gray-200 group"
  >
    
    <v-icon v-if="icon" :name="icon" scale="2" :class="iconClass" />
    <img v-else-if="img" :src="img" alt="Contact Icon" class="w-12 h-12 object-contain" />
    <div class="text-center">
      <div class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{{ platform }}</div>
      <div class="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ label }}</div>
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  href: string;
  icon?: string;
  img?: string;
  platform: string;
  label: string;
  iconClass?: string;
}>();
</script>
