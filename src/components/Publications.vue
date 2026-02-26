<template>
  <div class="flex flex-col gap-4">
    <a
      v-for="pub in publications"
      :key="pub.href"
      :href="pub.href"
      target="_blank"
      rel="noopener noreferrer"
      class="flex flex-col gap-2 px-6 py-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{{ pub.journal }}</div>
      <div class="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
        {{ pub.title }}
      </div>
      <div class="text-xs text-gray-400 dark:text-gray-500">{{ pub.year }}</div>
    </a>
  </div>
</template>

<script setup lang="ts">
const publications = [
  {
    title: 'Decomposing oceanic temperature and salinity change using ocean carbon change',
    journal: 'Ocean Science',
    year: '2022',
    href: 'https://os.copernicus.org/articles/18/523/2022',
  },
  {
    title: 'Remineralisation changes dominate oxygen variability in the North Atlantic',
    journal: 'Ocean Science',
    year: '2026',
    href: 'https://os.copernicus.org/articles/22/225/2026/os-22-225-2026.html',
  },
  {
    title: 'OrgAlkCalc: Estimation of organic alkalinity quantities and acid-base properties with proof of concept in Dublin Bay',
    journal: 'Marine Chemistry',
    year: '2023',
    href: 'https://www.sciencedirect.com/science/article/pii/S0304420323000300',
  },
];
</script>
