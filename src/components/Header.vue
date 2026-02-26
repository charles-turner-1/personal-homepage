<template>
  <nav class="sticky top-4 mx-auto z-50 w-auto max-w-4xl mt-4">
    <div
      class="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 px-6 py-3"
    >
      <div class="flex items-center justify-between gap-8">
        <!-- Left - Name -->
        <div
          class="text-sm font-semibold text-gray-600 dark:text-white whitespace-nowrap"
        >
          Charles Turner
        </div>

        <!-- Center - Navigation -->
        <div class="flex items-center gap-6">
          <RouterLink
            to="/"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            exact-active-class="!font-bold !text-gray-900 dark:!text-white"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            exact-active-class="!font-bold !text-gray-900 dark:!text-white"
          >
            About Me
          </RouterLink>
          <RouterLink
            to="/blog"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            exact-active-class="!font-bold !text-gray-900 dark:!text-white"
          >
            Blog
          </RouterLink>
          <RouterLink
            to="/projects"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            exact-active-class="!font-bold !text-gray-900 dark:!text-white"
          >
            Projects
          </RouterLink>
          <RouterLink
            to="/contact"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            exact-active-class="!font-bold !text-gray-900 dark:!text-white"
          >
            Contact
          </RouterLink>
        </div>

        <!-- Right - Git Commit -->
        <div class="whitespace-nowrap">
          <GitCommit />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import GitCommit from "./GitCommit.vue";
</script>
