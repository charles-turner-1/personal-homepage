<script setup lang="ts">
import { ref } from "vue";

const config = useRuntimeConfig();

const commitSha = config.public.gitCommitSha;
const buildTime = config.public.buildTime;

const shortCommitSha = commitSha ? commitSha.substring(0, 7) : "";
const commitUrl = commitSha
  ? `https://github.com/charles-turner-1/personal-homepage/commit/${commitSha}`
  : "";

// Popover management for commit SHA
const commitPopover = ref();
let hideTimeout: number | null = null;

const showCommitPopover = (event: Event) => {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  commitPopover.value?.show(event);
};

const scheduleHidePopover = () => {
  hideTimeout = window.setTimeout(() => {
    commitPopover.value?.hide();
  }, 300);
};

const cancelHidePopover = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
};

const hideCommitPopover = () => {
  scheduleHidePopover();
};

const copyCommitSha = async () => {
  if (!commitSha) return;

  try {
    await navigator.clipboard.writeText(commitSha);
    commitPopover.value?.hide();
  } catch (err) {
    console.error("Failed to copy commit SHA:", err);
  }
};
</script>

<template>
  <UPopover :content="{ side: 'bottom', align: 'end', sideOffset: 8 }">
    <UButton
      color="neutral"
      variant="subtle"
      size="sm"
      class="inline-flex items-center"
    >
      <UIcon name="i-bi-github" class="mr-1" />
      Commit: {{ shortCommitSha }}
    </UButton>

    <template #content>
      <div class="p-3 flex flex-col gap-2 min-w-88 max-w-120">
        <div class="text-sm text-gray-900 dark:text-gray-100 break-all">
          <UIcon name="i-bi-github" class="mr-2" />
          <strong>Commit:</strong>
          {{ commitSha }}
        </div>
        <div v-if="buildTime" class="text-xs text-gray-600 dark:text-gray-400">
          <strong>Built:</strong> {{ new Date(buildTime).toLocaleString() }}
        </div>
        <div class="pt-1">
          <UButton
            label="Copy SHA"
            icon="i-lucide-copy"
            size="xs"
            @click="copyCommitSha"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>