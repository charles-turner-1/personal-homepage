import { execSync } from "child_process";
// Get git commit SHA
const getGitCommitSha = () => {
  try {
    return execSync("git rev-parse HEAD").toString().trim();
  } catch {
    return "unknown";
  }
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/content", "@posthog/nuxt"],
  css: ["~/assets/css/main.css"],
  app: {
    baseURL:
      process.env.NODE_ENV === "production" ? "/personal-homepage/" : "/",
  },
  runtimeConfig: {
    public: {
      gitCommitSha: getGitCommitSha(),
      buildTime: new Date().toISOString(),
      emailjsServiceId: process.env.NUXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
      emailjsTemplateId: process.env.NUXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
      emailjsPublicKey: process.env.NUXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
    },
  },
  posthogConfig: {
    publicKey: process.env.NUXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NUXT_PUBLIC_POSTHOG_HOST,
    clientConfig: {
      persistence: "memory",
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: "github-light",
            dark: "github-dark",
            // TODO: Themes are shit.
          },
          langs: ["js", "ts", "vue", "json", "yaml", "bash", "python"],
        },
      },
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@emailjs/browser", "@vue/devtools-core", "@vue/devtools-kit"],
    },
  },
});

// Stolen from my old vite/primevue based homepage. Will need to be adapted into
// this nuxt project
//
//    /// <reference types="vitest" />
//    import { defineConfig } from "vite";
//    import vue from "@vitejs/plugin-vue";
//    import { execSync } from "child_process";
//    import tailwindcss from "@tailwindcss/vite";
//    import { fileURLToPath, URL } from "node:url";
//
//    // Get git commit SHA
//    const getGitCommitSha = () => {
//      try {
//        return execSync("git rev-parse HEAD").toString().trim();
//      } catch {
//        return "unknown";
//      }
//    };
//
//    // https://vite.dev/config/
//    export default defineConfig({
//      base: process.env.NODE_ENV === "production" ? "/personal-homepage/" : "/",
//      plugins: [vue(), tailwindcss()],
//      resolve: {
//        alias: {
//          "@": fileURLToPath(new URL("./src", import.meta.url)),
//        },
//      },
//      define: {
//        __GIT_COMMIT_SHA__: JSON.stringify(getGitCommitSha()),
//        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
//      },
//      server: {},
//      test: {
//        globals: true,
//        environment: "happy-dom",
//        setupFiles: ["./src/test/setup.ts"],
//        coverage: {
//          provider: "v8",
//          reporter: ["text", "json", "html"],
//          exclude: [
//            "node_modules/",
//            "src/test/",
//            "**/*.spec.ts",
//            "**/*.d.ts",
//            "vite.config.ts",
//            "tailwind.config.js",
//            "postcss.config.js",
//            "dist/assets/**",
//          ],
//        },
//      },
//    });
//
//
