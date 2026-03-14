import { createRouter, createWebHashHistory } from "vue-router";
import { ref } from "vue";
import { posthog } from "@/composables/usePosthog";


const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../components/Home.vue"),
    meta: {
      title: "Home",
    },
  },
  // Future routes can be added here
  {
    path: "/blog",
    name: "Blog",
    component: () => import("../components/Blog.vue"),
    meta: {
      title: "Blog",
    },
  },
  {
    path: "/projects",
    name: "Projects",
    component: () => import("../components/Projects.vue"),
    meta: {
      title: "Projects",
    },
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import("../components/Contact.vue"),
    meta: {
      title: "Contact",
    },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../components/AboutMe.vue"),
    meta: {
      title: "About Me",
    },
  },
  {
    path: "/projects/interactive-data-explorer",
    name: "InteractiveDataExplorer",
    component: () => import("../components/InteractiveDataExplorer.vue"),
    meta: {
      title: "Interactive Data Explorer",
    },
  },
  {
    path: "/projects/interactive-glodap-catalog",
    name: "InteractiveGLODAPCatalog",
    component: () => import("../glodap-viewer/InteractiveGLODAPCatalog.vue"),
    meta: {
      title: "Interactive GLODAP Catalog",
    },
  },
  {
    path: "/projects/zarr-data-streamer",
    name: "ZarrDataStreamer",
    component: () => import("../components/ZarrDataStreamer.vue"),
    meta: {
      title: "Zarr Data Streamer",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Global loading state for navigation
export const isNavigating = ref(false);

// Set page title and show loading during navigation
router.beforeEach((to, _from, next) => {
  isNavigating.value = true;
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }
  next();
});

router.afterEach((to) => {
  posthog.capture("$pageview", { path: to.fullPath, name: to.name });
  // Small delay to ensure component is mounted
  setTimeout(() => {
    isNavigating.value = false;
  }, 100);
});

export default router;
