import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./style.css";
import App from "./App.vue";
import Aura from "@primeuix/themes/aura";

// PrimeVue imports
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

// Syntax highlighting
import "highlight.js/styles/github-dark.css";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import hljsVuePlugin from "@highlightjs/vue-plugin";

// OhVueIcons
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {ViFileTypePython, ViFileTypeJulia, ViFileTypeRust, ViFileTypeVue, ViFileTypeTypescript, BiGithub} from "oh-vue-icons/icons"

addIcons(ViFileTypePython, ViFileTypeJulia, ViFileTypeRust, ViFileTypeVue, ViFileTypeTypescript, BiGithub);

hljs.registerLanguage("python", python);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(hljsVuePlugin);
app.use(router);
app.component("v-icon", OhVueIcon);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

// PrimeVue ToastService provides the context used by `useToast()`.
app.use(ToastService);

// Register Tooltip directive
app.directive("tooltip", Tooltip);

app.mount("#app");
