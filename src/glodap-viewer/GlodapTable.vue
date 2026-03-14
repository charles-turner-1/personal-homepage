<template>
  <div class="glodap-table-container">
    <div
      class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
    >
      <!-- Left side - Title and description -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          GLODAP Interactive Data Explorer
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Explore the GLODAPv2.2023 Merged Master File
        </p>
      </div>

      <!-- Vertical divider (hidden on mobile) -->
      <div
        class="hidden lg:block w-px h-16 bg-gray-300 dark:bg-gray-600 mx-6"
      ></div>

      <!-- Right side - Documentation link -->
      <div class="flex-shrink-0">
        <div
          class="text-sm text-gray-500 dark:text-gray-400 mb-2 lg:text-right"
        >
          Documentation
        </div>
        <div class="flex flex-col space-y-2">
          <a
            href="https://www.glodap.info/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-sm font-medium"
          >
            <i class="pi pi-external-link text-xs"></i>
            GLODAP Documentation
          </a>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
    >
      <div class="flex items-center">
        <i class="pi pi-exclamation-triangle text-red-500 mr-2"></i>
        <span class="text-red-700 dark:text-red-300 font-medium"
          >Error loading data:</span
        >
      </div>
      <p class="text-red-600 dark:text-red-400 mt-1">{{ error }}</p>
      <button
        @click="reload"
        class="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        <i class="pi pi-refresh mr-2"></i>
        Retry
      </button>
    </div>

    <!-- Filters -->
    <FilterSelectors
      v-if="Object.keys(filterOptions).length > 0"
      v-model="activeFilters"
      :filter-options="filterOptions"
      :dynamic-filter-options="filterOptions"
      :toast="false"
      class="mb-2"
      @clear="onFilterClear"
    />

    <!-- Data Table (always rendered; loading overlay handled by DataTable itself) -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
      <DataTable
        lazy
        :value="rows"
        :loading="loading"
        :paginator="true"
        :first="first"
        :rows="limit"
        :rows-per-page-options="ROW_OPTIONS"
        :total-records="totalRecords"
        data-key="G2expocode"
        show-gridlines
        striped-rows
        resizable-columns
        column-resize-mode="expand"
        class="glodap-datatable"
        @page="onPageChange"
        @update:rows="onRowsChange"
      >
        <template #header>
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 overflow-x-auto"
          >
            <div class="flex items-center gap-2">
              <i class="pi pi-database text-blue-600 text-xl"></i>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">
                Observations ({{ totalRecords.toLocaleString() }})
              </span>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <!-- Search by expocode / DOI -->
              <div class="relative">
                <i
                  class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                ></i>
                <InputText
                  v-model="searchValue"
                  placeholder="Search expocode or DOI..."
                  class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                />
              </div>

              <!-- Column Toggle -->
              <MultiSelect
                :model-value="selectedColumns"
                @update:model-value="onToggle"
                :options="allColumns"
                option-label="header"
                placeholder="Select Columns"
                class="min-w-48"
                display="chip"
              >
                <template #option="{ option }">
                  <span>{{ option.header }}</span>
                </template>
              </MultiSelect>
            </div>
          </div>
        </template>

        <template #empty>
          <div class="text-center py-8">
            <i class="pi pi-inbox text-gray-400 text-4xl mb-3 block"></i>
            <p class="text-gray-500 dark:text-gray-400">
              No observations found
            </p>
          </div>
        </template>

        <Column
          v-for="col in selectedColumns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          class="min-w-32"
        >
          <template #body="{ data }">
            <span class="font-medium text-gray-900 dark:text-gray-100">
              {{ formatValue(data[col.field]) }}
            </span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import FilterSelectors from "./FilterSelectors.vue";
import { useGlodapData } from "./useGlodapData";
import { usePosthog } from "@/composables/usePosthog";

const { capture } = usePosthog();

const {
  rows,
  totalRecords,
  loading,
  error,
  fetchPage,
  fetchCount,
  fetchFilterOptions,
} = useGlodapData();

const ROW_OPTIONS = [10, 25, 50, 100];
const limit = ref(25);
const page = ref(0);
const first = computed(() => page.value * limit.value);
const searchValue = ref("");

// Columns with discrete values that are useful to filter on
const FILTERABLE_COLUMNS = [
  "G2expocode",
  "G2region",
  "G2year",
  "G2month",
  "G2cruise",
];
const filterOptions = ref<Record<string, string[]>>({});
const activeFilters = ref<Record<string, string[]>>({});

// Debounce timer for search
let searchTimer: ReturnType<typeof setTimeout> | null = null;

function load() {
  fetchCount(searchValue.value, activeFilters.value);
  fetchPage(limit.value, first.value, searchValue.value, activeFilters.value);
}

// Initial load + fetch filter option lists
load();
fetchFilterOptions(FILTERABLE_COLUMNS).then((opts) => {
  filterOptions.value = opts;
});

watch(searchValue, () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 0;
    load();
    if (searchValue.value) {
      capture("glodap_search", { query: searchValue.value });
    }
  }, 400);
});

watch(
  activeFilters,
  (filters) => {
    page.value = 0;
    load();
    capture("glodap_filter_applied", { filters });
  },
  { deep: true },
);

function onFilterClear() {
  activeFilters.value = {};
  capture("glodap_filter_cleared");
}

function onPageChange(event: any) {
  page.value = event.page;
  fetchPage(
    limit.value,
    event.page * limit.value,
    searchValue.value,
    activeFilters.value,
  );
  capture("glodap_page_changed", { page: event.page, rows: limit.value });
}

function onRowsChange(newLimit: number) {
  limit.value = newLimit;
  page.value = 0;
  load();
  capture("glodap_rows_per_page_changed", { rows: newLimit });
}

function reload() {
  page.value = 0;
  load();
}

const KNOWN_COLUMNS = [
  "G2expocode",
  "G2cruise",
  "G2station",
  "G2cast",
  "G2region",
  "G2latitude",
  "G2longitude",
  "G2depth",
  "G2year",
  "G2month",
  "G2day",
  "G2hour",
  "G2minute",
  "G2bottomdepth",
  "G2maxsampdepth",
  "G2bottle",
  "G2pressure",
  "G2temperature",
  "G2salinity",
  "G2salinityf",
  "G2oxygen",
  "G2oxygenf",
  "G2nitrate",
  "G2nitratef",
  "G2phosphate",
  "G2phosphatef",
  "G2silicate",
  "G2silicatef",
  "G2tco2",
  "G2tco2f",
  "G2talk",
  "G2talkf",
  "G2chla",
  "G2chlaf",
  "G2doi",
];

const allColumns = computed(() => {
  const fields =
    rows.value.length > 0 ? Object.keys(rows.value[0]!) : KNOWN_COLUMNS;
  return fields.map((f) => ({ field: f, header: f }));
});

const DEFAULT_VISIBLE = new Set([
  "G2expocode",
  "G2cruise",
  "G2station",
  "G2region",
  "G2latitude",
  "G2longitude",
  "G2depth",
  "G2year",
  "G2temperature",
  "G2salinity",
  "G2oxygen",
  "G2doi",
]);

const selectedColumns = ref(
  KNOWN_COLUMNS.filter((f) => DEFAULT_VISIBLE.has(f)).map((f) => ({
    field: f,
    header: f,
  })),
);

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    if (value === -9999) return "N/A";
    return Number.isInteger(value)
      ? String(value)
      : value.toFixed(4).replace(/\.?0+$/, "");
  }
  return String(value);
};

const onToggle = (value: any[]) => {
  selectedColumns.value = allColumns.value.filter((col) =>
    value.some((v) => v.field === col.field),
  );
  capture("glodap_columns_changed", { columns: value.map((c) => c.field) });
};
</script>

<style scoped>
.glodap-table-container {
  width: 100%;
  max-width: calc(100vw - 4rem);
  margin: 0 auto;
  padding: 2rem;
}

:deep(.glodap-datatable) {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.p-datatable-header) {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-datatable-thead > tr > th) {
  background-color: #f3f4f6;
  color: #111827;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-datatable-tbody > tr) {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s ease;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f9fafb;
}

:deep(.p-datatable-tbody > tr > td) {
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

:deep(.p-paginator) {
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

:deep(.p-inputtext) {
  background-color: #ffffff;
  color: #111827;
}

:deep(.p-multiselect) {
  background-color: #ffffff;
  border-color: #d1d5db;
}

@media (prefers-color-scheme: dark) {
  :deep(.glodap-datatable) {
    border-color: #4b5563;
  }
  :deep(.p-datatable-header) {
    background-color: #374151;
    border-bottom-color: #4b5563;
  }
  :deep(.p-datatable-thead > tr > th) {
    background-color: #374151;
    color: #f9fafb;
    border-bottom-color: #4b5563;
  }
  :deep(.p-datatable-tbody > tr) {
    border-bottom-color: #374151;
  }
  :deep(.p-datatable-tbody > tr:hover) {
    background-color: #374151;
  }
  :deep(.p-datatable-tbody > tr > td) {
    color: #f9fafb;
    border-bottom-color: #374151;
  }
  :deep(.p-paginator) {
    background-color: #374151;
    border-top-color: #4b5563;
  }
  :deep(.p-inputtext) {
    background-color: #1f2937;
    color: #f9fafb;
  }
  :deep(.p-multiselect) {
    background-color: #1f2937;
    border-color: #4b5563;
  }
}
</style>
