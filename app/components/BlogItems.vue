<script setup lang="ts">
const { data: posts } = await useAsyncData("blog-posts", async () => {
  const pages = await queryCollection("content").all();

  return pages
    .filter((page) => page.path?.startsWith("/blog/") && page.path !== "/blog")
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;

      return bTime - aTime;
    })
    .map((page) => ({
      href: page.meta?.href ?? page.path,
      title: page.title ?? page.meta?.title,
      description: page.description ?? page.meta?.description,
      date: page.date ?? page.meta?.date,
    }));
});

const formatPostDate = (value?: string) => {
  if (!value) {
    return "Draft";
  }

  return new Date(value).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
  });
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <RouterLink
      v-for="post in posts ?? []"
      :key="post.href"
      :to="post.href"
      class="flex flex-col gap-2 px-6 py-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div
        class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium"
      >
        {{ formatPostDate(post.date) }}
      </div>
      <div
        class="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug"
      >
        {{ post.title }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        {{ post.description }}
      </div>
    </RouterLink>
  </div>
</template>
