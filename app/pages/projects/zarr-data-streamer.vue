<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

import ref01deg from "~/assets/refs/ref-01deg.json";
import ref1deg from "~/assets/refs/ref-1deg.json";
// import refAtmosDaily from '~/assets/refs/ref-atmos-daily.json';

const activeTab = ref("sst01");

const items = ref<TabsItem[]>([
  {
    label: "Sea Surface Temperature: 0.1°",
    value: "sst01",
    slot: "sst01",
  },
  {
    label: "Sea Surface Temperature: 1°",
    value: "sst1",
    slot: "sst1",
  },
  // OOMS
  // {
  //   label: 'Atmospheric Daily Data',
  //   value: 'atmos',
  //   slot: 'atmos',
  // },
]);
</script>

<template>
  <div class="container mx-auto p-2 text-left">
    <NuxtLink to="/projects" class="text-left">
      <span
        class="ml-1 text-blue-600 dark:text-blue-400 hover:underline inline-flex gap-1 items-center"
      >
        <UIcon :name="'i-lucide-chevron-left'" class="size-5" />
        Back to Projects
      </span>
    </NuxtLink>

    <!-- TODO: About component should be a markdown file -->
    <AboutDataStreamer />
    <UTabs :items="items" v-model="activeTab">
      <template #sst01>
        <ZarrMap
          :refSpec="ref01deg"
          :varName="'sst_m'"
          :latName="'nj'"
          :lon-name="'ni'"
        />
      </template>

      <template #sst1>
        <ZarrMap
          :refSpec="ref1deg"
          :varName="'sst'"
          :lat-name="'yt_ocean'"
          :lon-name="'xt_ocean'"
          units="K"
          :fillValue="0"
        />
      </template>

      <!-- Too big, ooms! -->
      <!-- <template #atmos>
    <ZarrMap
      :refSpec="refAtmosDaily"
      :varName="'fld_s03i236'"
      :lat-name="'lat'"
      :lon-name="'lon'"
      units="K"
      :fillValue="1.0000000200408773e20"
    />
   </template>  -->
    </UTabs>
  </div>
</template>
