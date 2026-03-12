<template>
  <div class="container mx-auto mt-10 p-6">
    <RouterLink
      to="/projects"
      class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors my-4"
    >
      <v-icon name="hi-arrow-left" scale="0.9" />
      Back to Projects
    </RouterLink>

    <!-- About accordion -->
    <div
      class="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <button
        class="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        @click="aboutOpen = !aboutOpen"
        :aria-expanded="aboutOpen"
      >
        <span
          class="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100"
        >
          <i class="pi pi-info-circle text-blue-500"></i>
          About this tool
        </span>
        <i
          class="pi pi-chevron-down text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': aboutOpen }"
        ></i>
      </button>

      <div
        v-show="aboutOpen"
        class="px-5 py-4 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300 space-y-3 leading-relaxed"
      >
        <span
          class="flex items-center gap-2 font-semibold text-gray-600 dark:text-gray-100"
        >
          <i class="pi pi-info-circle text-blue-500"></i>
          Disclaimer: This info was written by Claude Sonnet 4.6. It's mostly
          right (especially the technical bits), but may be subtly misleading.
          At some point, I might come back and rewrite it. At some point, I
          might come back and rewrite it. At some point, I might come back and
          rewrite it.
        </span>

        <p>
          Climate model output is large. The ACCESS-OM2-01 run used here
          produces roughly a terabyte of NetCDF files per simulated year, spread
          across thousands of individual files on
          <a
            href="https://pawsey.org.au/systems/acacia/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 dark:text-blue-400 hover:underline"
            >Acacia</a
          >
          — Pawsey Supercomputing Centre's object storage. Traditionally, doing
          anything with that data means either being on the HPC cluster
          yourself, or downloading a substantial chunk of it first. Neither
          option is great if you just want to take a quick look.
        </p>
        <p>
          The first step in the pipeline is virtualisation with
          <a
            href="https://virtualizarr.readthedocs.io/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 dark:text-blue-400 hover:underline"
            >VirtualiZarr</a
          >. Rather than copying or converting the data, VirtualiZarr reads the
          internal structure of each NetCDF file — where each variable's chunks
          live on disk, their byte offsets and lengths — and builds a
          lightweight <em>virtual</em> Zarr store. Nothing is moved; you end up
          with a reference catalogue that says "chunk <code>[0,0,0]</code> of
          <code>sst_m</code> is bytes 171,279,300–172,408,502 of this file on
          S3". The whole catalogue for 42 months of the global 0.1° CICE sea ice
          run shown here fits in a few-hundred-kilobyte JSON file.
        </p>
        <p>
          That JSON is written out in
          <a
            href="https://fsspec.github.io/kerchunk/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 dark:text-blue-400 hover:underline"
            >Kerchunk</a
          >
          reference format — a simple spec that maps Zarr chunk keys to
          <code>[url, offset, length]</code> triples. Any Zarr-aware client that
          knows how to issue HTTP range requests can consume it directly,
          without any special server software. The files themselves never move;
          you're just handing the client a roadmap.
        </p>
        <p>
          In the browser, the reference JSON is loaded and passed to
          <a
            href="https://github.com/manzt/zarrita.js"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 dark:text-blue-400 hover:underline"
            >zarrita.js</a
          >
          (a TypeScript Zarr implementation) backed by a range-request store.
          When you select a time step, the client works out which chunks are
          needed for that slice, fires off a handful of HTTP
          <code>Range</code> requests to the object storage endpoint,
          decompresses the chunks in-browser using a WASM codec, and renders the
          result. You never download the full dataset — for a single monthly SST
          field at 0.1°, that's pulling around 4–8 MB of compressed chunks out
          of a ~200 GB archive.
        </p>
        <p>
          The result is, again, completely <strong>serverless</strong>: no
          backend, no tiling service, no data pipeline running on a VM
          somewhere. The only infrastructure is the object storage bucket
          (already there for model output) and the static site you're reading
          this on. The main catch is that the S3 bucket needs permissive CORS
          headers — which, at a supercomputing centre, is sometimes easier said
          than done.
        </p>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap items-center gap-4 my-4">
      <div class="flex items-center gap-3 flex-1 min-w-[220px]">
        <label
          class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
        >
          Time step:
          <span class="font-mono text-blue-600 dark:text-blue-400"
            >{{ timeIndex + 1 }} / {{ TIME_STEPS }}</span
          >
        </label>
        <input
          type="range"
          min="0"
          :max="TIME_STEPS - 1"
          v-model.number="timeIndex"
          @input="onTimeChange"
          class="flex-1 accent-blue-600"
        />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Opacity:</label
        >
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="opacity"
          @input="onOpacityChange"
          class="w-24 accent-blue-600"
        />
      </div>
      <!-- Loading indicator -->
      <div
        v-if="loadingState.loading"
        class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
      >
        <i class="pi pi-spin pi-spinner"></i>
        <span>{{
          loadingState.chunks ? "Fetching chunks…" : "Loading metadata…"
        }}</span>
      </div>
      <div
        v-if="loadingState.error"
        class="flex items-center gap-2 text-sm text-red-500"
      >
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ loadingState.error.message }}</span>
      </div>
    </div>

    <!-- Map -->
    <div
      ref="mapContainer"
      class="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      style="height: 480px"
    ></div>

    <!-- Colourbar -->
    <div
      class="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400"
    >
      <span>{{ CLIM[0] }}°C</span>
      <div class="flex-1 h-3 rounded" :style="colourbarStyle"></div>
      <span>{{ CLIM[1] }}°C</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { RouterLink } from "vue-router";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ZarrLayer, type LoadingState } from "@carbonplan/zarr-layer";
import ReferenceStore from "@zarrita/storage/ref";
import refSpec from "@/assets/ref-01deg.json";

// ── constants ────────────────────────────────────────────────────────────────
const TIME_STEPS = 42;
const CLIM: [number, number] = [-2, 40];
// Viridis-ish 8-stop palette
const COLORMAP = [
  "#440154",
  "#31688e",
  "#35b779",
  "#fde725",
  "#f1605d",
  "#d73027",
  "#a50026",
  "#ffffff",
];

// ── state ─────────────────────────────────────────────────────────────────────
const aboutOpen = ref(false);
const mapContainer = ref<HTMLDivElement | null>(null);
const timeIndex = ref(0);
const opacity = ref(85);
const loadingState = ref<LoadingState>({
  loading: false,
  metadata: false,
  chunks: false,
  error: null,
});

// ── map + layer refs ──────────────────────────────────────────────────────────
let map: maplibregl.Map | null = null;
let zarrLayer: ZarrLayer | null = null;

// ── colourbar gradient ────────────────────────────────────────────────────────
const colourbarStyle = computed(() => ({
  background: `linear-gradient(to right, ${COLORMAP.join(", ")})`,
}));

// ── lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  if (!mapContainer.value) return;

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {},
      layers: [
        {
          id: "background",
          type: "background",
          paint: { "background-color": "#1a1a2e" },
        },
      ],
    },
    center: [0, 0],
    zoom: 1,
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");

  map.on("load", async () => {
    if (!map) return;

    // Kerchunk refs contain s3:// URIs pointing at Pawsey Ceph, not AWS.
    // Rewrite s3://<bucket>/... → https://projects.pawsey.org.au/<bucket>/...
    const PAWSEY_ENDPOINT = "https://projects.pawsey.org.au";
    const rawRefs = (refSpec as Record<string, unknown>).refs as Record<
      string,
      unknown
    >;
    const rewrittenRefs: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rawRefs)) {
      if (
        Array.isArray(v) &&
        typeof v[0] === "string" &&
        v[0].startsWith("s3://")
      ) {
        rewrittenRefs[k] = [
          v[0].replace(/^s3:\/\//, `${PAWSEY_ENDPOINT}/`),
          v[1],
          v[2],
        ];
      } else {
        rewrittenRefs[k] = v;
      }
    }
    const patchedSpec = { ...refSpec, refs: rewrittenRefs };
    const store = ReferenceStore.fromSpec(
      patchedSpec as Record<string, unknown>,
    );

    zarrLayer = new ZarrLayer({
      id: "sst",
      store,
      variable: "sst_m",
      selector: { time: 0 },
      colormap: COLORMAP,
      clim: CLIM,
      opacity: opacity.value / 100,
      zarrVersion: 2,
      spatialDimensions: { lat: "nj", lon: "ni" },
      bounds: [-180, -90, 180, 90],
      onLoadingStateChange: (state) => {
        loadingState.value = state;
      },
    });

    map.addLayer(zarrLayer as unknown as maplibregl.CustomLayerInterface);
  });
});

onUnmounted(() => {
  map?.remove();
  map = null;
  zarrLayer = null;
});

// ── handlers ──────────────────────────────────────────────────────────────────
function onTimeChange() {
  zarrLayer?.setSelector({ time: timeIndex.value });
}

function onOpacityChange() {
  zarrLayer?.setOpacity(opacity.value / 100);
}
</script>
