import posthog from "posthog-js";

let isInitialized = false;

export { posthog };

export function usePosthog() {
  const config = useRuntimeConfig();

  if (import.meta.client && !isInitialized && config.public.posthogKey) {
    posthog.init(config.public.posthogKey, {
      api_host: config.public.posthogHost || undefined,
      defaults: "2026-01-30",
      persistence: "memory",
      capture_pageview: false,
      capture_pageleave: true,
    });
    isInitialized = true;
  }

  function capture(event: string, properties?: Record<string, unknown>) {
    if (!import.meta.client || !isInitialized) {
      return;
    }

    posthog.capture(event, properties);
  }

  return { capture };
}
