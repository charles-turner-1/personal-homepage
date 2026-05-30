<script setup lang="ts">
import LinkCard from "./LinkCard.vue";

const projects = [
  {
    name: "Interactive Data Explorer",
    icons: ["i-vscode-icons-file-type-vue", "i-vscode-icons-file-type-typescript"],
    description:
      "An interactive explorer for browsing and visualising scientific datasets.",
    href: "/projects/interactive-data-explorer",
  },
  {
    name: "Interactive GLODAP Catalog",
    icons: ["i-vscode-icons-file-type-vue", "i-vscode-icons-file-type-typescript"],
    description:
      "An interactive catalog for exploring GLODAP ocean chemistry data.",
    href: "/projects/interactive-glodap-catalog",
  },
  {
    name: "Zarr Data Streamer",
    icons: [
      "i-vscode-icons-file-type-python",
      "i-vscode-icons-file-type-vue",
      "i-vscode-icons-file-type-typescript",
    ],
    description:
      "Proof of concept for streaming zarr data out of object storage (CEPH/S3, Acacia) straight to the browser.",
    href: "/projects/zarr-data-streamer",
  },
];
</script>

<template>
  <div class="grid grid-cols-1 gap-4">
    <LinkCard
      v-for="project in projects"
      :key="project.href"
      v-bind="project"
    />
  </div>
</template>