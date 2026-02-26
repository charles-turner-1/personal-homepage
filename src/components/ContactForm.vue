<template>
  <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto flex flex-col gap-4">
    <div class="flex gap-4">
      <div class="flex flex-col gap-1 flex-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <InputText v-model="form.name" placeholder="Your name" class="w-full" />
      </div>
      <div class="flex flex-col gap-1 flex-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <InputText v-model="form.email" type="email" placeholder="you@example.com" class="w-full" />
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
      <Textarea v-model="form.message" autoResize placeholder="What can I do for you?" rows="5" class="w-full resize-none" />
    </div>
    <!-- Honeypot field: hidden from real users, bots will fill it in -->
    <div aria-hidden="true" class="absolute -left-[9999px] -top-[9999px] overflow-hidden">
      <label for="bot-check">Tick me if you're a bot</label>
      <input id="bot-check" v-model="honeypot" type="checkbox" tabindex="-1" autocomplete="off" />
    </div>

    <div class="flex items-center justify-end gap-4">
      <Transition name="fade">
        <span v-if="status === 'success'" class="text-sm text-green-600 dark:text-green-400">
          <i class="pi pi-check-circle mr-1" />Message sent!
        </span>
        <span v-else-if="status === 'error'" class="text-sm text-red-500 dark:text-red-400">
          <i class="pi pi-times-circle mr-1" />Something went wrong — please try again.
        </span>
      </Transition>
      <Button
        type="submit"
        label="Send message"
        icon="pi pi-send"
        :loading="loading"
        :disabled="loading"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import emailjs from '@emailjs/browser';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

const form = reactive({ name: '', email: '', message: '' });
const honeypot = ref(false);
const loading = ref(false);
const status = ref<'idle' | 'success' | 'error'>('idle');

async function handleSubmit() {
  if (honeypot.value) return;

  loading.value = true;
  status.value = 'idle';

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
      },
      { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
    );
    status.value = 'success';
    form.name = '';
    form.email = '';
    form.message = '';
  } catch (error) {
    status.value = 'error';
  } finally {
    loading.value = false;
  }
}
</script>
