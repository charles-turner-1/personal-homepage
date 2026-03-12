import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as duckdb from '@duckdb/duckdb-wasm';

export interface CatalogRow {
  name: string;
  model: string[];
  description: string;
  realm: string[];
  frequency: string[];
  variable: string[];
  yaml: string;
  searchableModel: string;
  searchableRealm: string;
  searchableFrequency: string;
  searchableVariable: string;
}
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';

/**
 * URL to the metacatalog parquet file. Uses a CORS proxy in production
 * and a local API path in development.
 */
const METACAT_URL = 'https://object-store.rc.nectar.org.au/v1/AUTH_685340a8089a4923a71222ce93d5d323/glodap-test/GLODAPv2.2023_Merged_Master_File.parquet';

/** DuckDB WASM bundles used by the client; selectBundle picks the best one. */
const DUCKDB_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: mvp_worker,
  },
};

// We'll read the raw parquet rows and normalize them in JS instead
// of using a large SQL CASE expression. This keeps the coercion
// logic in a single place and works better with DuckDB WASM's
// JavaScript-oriented usage patterns.

export const useCatalogStore = defineStore('catalog', () => {
  // State
  const data = ref<CatalogRow[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const catalogCount = computed(() => data.value.length);
  const hasData = computed(() => data.value.length > 0);
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => error.value !== null);

  /**
   * Download the parquet file from the configured endpoint and return it as a
   * Uint8Array.
   *
   * @throws {Error} when the HTTP request fails or returns a non-OK status.
   */
  async function fetchMetaCatFile(): Promise<Uint8Array> {
    return fetch(METACAT_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch parquet file: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => new Uint8Array(arrayBuffer));
  }

  /**
   * Initialize a DuckDB Async instance using the configured bundles and
   * a dedicated web worker. Returns `{ db, conn }` where `conn` is a
   * connected AsyncDuckDBConnection.
   */
  async function initializeDuckDB() {
    const bundle = DUCKDB_BUNDLES.mvp;
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();
    const db = new duckdb.AsyncDuckDB(logger, worker);

    await db.instantiate(bundle.mainModule);
    const conn = await db.connect();

    return { db, conn };
  }

  /**
   * Register the provided parquet bytes under a fixed filename and run
   * the normalization query. Returns an array of `CatalogRow` items.
   *
   * @param db - DuckDB Async instance
   * @param conn - Active connection associated with `db`
   * @param uint8Array - Contents of the parquet file
   */
  async function queryMetaCatalogPq(
    db: duckdb.AsyncDuckDB,
    conn: duckdb.AsyncDuckDBConnection,
    uint8Array: Uint8Array,
  ): Promise<CatalogRow[]> {
    // Register the parquet file
    await db.registerFileBuffer('GLODAPv2.2023_Merged_Master_File.parquet', uint8Array);

    // Read the parquet as raw rows and normalize in JavaScript
    const queryResult = await conn.query("SELECT * FROM read_parquet('GLODAPv2.2023_Merged_Master_File.parquet') limit 1000");

    const rawData = queryResult.toArray();

    // Transform to our interface with proper array handling
    const transformedData = rawData.map((row: any) => {
      const processListField = (value: any): string[] => {
        if (value === null || value === undefined) return [];

        // Handle DuckDB Vector objects
        if (value && typeof value.toArray === 'function') {
          return value
            .toArray()
            .filter((v: any) => v !== null && v !== undefined)
            .map(String);
        }

        if (Array.isArray(value)) return value.filter((v) => v !== null && v !== undefined).map(String);

        if (typeof value === 'string') {
          // Handle potential JSON strings or comma-separated values
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
          } catch {
            // If not JSON, treat as single value
            return [value];
          }
        }
        return [String(value)];
      };

      return {
        name: row.name || '',
        model: processListField(row.model),
        description: row.description || '',
        realm: processListField(row.realm),
        frequency: processListField(row.frequency),
        variable: processListField(row.variable),
        yaml: row.yaml || '', // Add YAML field
        // Add searchable versions for better search
        searchableModel: processListField(row.model).join(', '),
        searchableRealm: processListField(row.realm).join(', '),
        searchableFrequency: processListField(row.frequency).join(', '),
        searchableVariable: processListField(row.variable).join(', '),
      };
    });

    return transformedData;
  }

  // Actions
  /**
   * Public action to fetch and populate the metacatalog into the store.
   * Reuses in-memory data when already loaded.
   */
  async function fetchCatalogData() {
    // If we already have data and no error, don't fetch again
    if (data.value.length > 0 && !error.value) {
      console.log('✅ Using cached metacatalog data');
      return;
    }

    loading.value = true;
    error.value = null;

    let db: duckdb.AsyncDuckDB | null = null;
    let conn: duckdb.AsyncDuckDBConnection | null = null;

    try {
      // Fetch parquet file and initialize DuckDB concurrently
      const [uint8Array, dbConnection] = await Promise.all([fetchMetaCatFile(), initializeDuckDB()]);

      db = dbConnection.db;
      conn = dbConnection.conn;

      // Query and transform data
      data.value = await queryMetaCatalogPq(db, conn, uint8Array);
    } catch (err) {
      console.error('❌ Error loading catalog data:', err);
      error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
      // Cleanup
      if (conn) await conn.close();
      if (db) await db.terminate();
      loading.value = false;
    }
  }

  /** Reset catalog-related state held by the store. */
  function clearData() {
    data.value = [];
    error.value = null;
  }

  return {
    // State
    data,
    loading,
    error,

    // Getters
    catalogCount,
    hasData,
    isLoading,
    hasError,

    // Actions
    fetchCatalogData,
    clearData,
  };
});
