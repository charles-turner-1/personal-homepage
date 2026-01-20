import { createRouter, createWebHashHistory } from "vue-router";
import { ref } from "vue";

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
  }
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

router.afterEach(() => {
  // Small delay to ensure component is mounted
  setTimeout(() => {
    isNavigating.value = false;
  }, 100);
});

export default router;
