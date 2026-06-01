<script setup lang="ts">
import emailjs from "@emailjs/browser";

const config = useRuntimeConfig();
const emailjsServiceId = String(config.public.emailjsServiceId || "");
const emailjsTemplateId = String(config.public.emailjsTemplateId || "");
const emailjsPublicKey = String(config.public.emailjsPublicKey || "");
const form = reactive({ name: "", email: "", message: "" });
const honeypot = ref(false);
const loading = ref(false);
const status = ref<"idle" | "success" | "error">("idle");

async function handleSubmit() {
  if (honeypot.value) return;

  loading.value = true;
  status.value = "idle";

  try {
    await emailjs.send(
      emailjsServiceId,
      emailjsTemplateId,
      {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
      },
      { publicKey: emailjsPublicKey },
    );
    status.value = "success";
    form.name = "";
    form.email = "";
    form.message = "";
  } catch (error) {
    status.value = "error";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="max-w-lg mx-auto flex flex-col gap-4"
  >
    <div class="flex gap-4">
      <div class="flex flex-col gap-1 flex-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Name</label
        >
        <UInput v-model="form.name" placeholder="Your name" class="w-full" />
      </div>
      <div class="flex flex-col gap-1 flex-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Email</label
        >
        <UInput
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          class="w-full"
        />
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
        >Message</label
      >
      <UTextarea
        v-model="form.message"
        autoResize
        placeholder="What can I do for you?"
        :rows="5"
        class="w-full resize-none"
      />
    </div>
    <!-- Honeypot field: hidden from real users, bots will fill it in -->
    <div aria-hidden="true" class="sr-only">
      <label for="bot-check">Tick me if you're a bot</label>
      <input
        id="bot-check"
        v-model="honeypot"
        type="checkbox"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <div class="flex items-center justify-end gap-4">
      <Transition name="fade">
        <span
          v-if="status === 'success'"
          class="text-sm text-green-600 dark:text-green-400"
        >
          <i class="pi pi-check-circle mr-1" />Message sent!
        </span>
        <span
          v-else-if="status === 'error'"
          class="text-sm text-red-500 dark:text-red-400"
        >
          <i class="pi pi-times-circle mr-1" />Something went wrong — please try
          again.
        </span>
      </Transition>
      <UButton
        type="submit"
        label="Send message"
        icon="i-bi-send"
        :loading="loading"
        :disabled="loading"
      />
    </div>
  </form>
</template>
