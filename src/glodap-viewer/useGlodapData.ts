import { ref, onUnmounted } from 'vue';
import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';

export type GlodapRow = Record<string, string | number | null>;

const GLODAP_URL =
  'https://object-store.rc.nectar.org.au/v1/AUTH_685340a8089a4923a71222ce93d5d323/glodap-test/GLODAPv2.2023_Merged_Master_File.parquet';

const FILE_NAME = 'GLODAPv2.2023_Merged_Master_File.parquet';

const DUCKDB_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: mvp_worker,
  },
};

/**
 * Coerce a raw DuckDB cell value to a plain JS string, number, or null.
 * Handles BigInt columns and leaves -9999 (GLODAP missing sentinel) as-is.
 */
function coerceValue(value: unknown): string | number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return value;
  const prim = (value as any)?.valueOf?.();
  if (typeof prim === 'number' || typeof prim === 'string') return prim;
  return String(value);
}

/**
 * Composable for paginated access to the GLODAP parquet via DuckDB-WASM.
 *
 * DuckDB registers the file as a remote URL and uses HTTP range requests to
 * fetch only the parquet footer on init, then the row groups needed for each
 * LIMIT/OFFSET query — avoiding loading the full ~2 GB file into WASM memory.
 *
 * The DuckDB instance is kept alive across page fetches and torn down when
 * the component is unmounted.
 */
/** String-typed columns that need quoted IN clauses rather than numeric ones. */
const STRING_FILTER_COLUMNS = new Set(['G2expocode', 'G2doi']);

export function useGlodapData() {
  const rows = ref<GlodapRow[]>([]);
  const totalRecords = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  let db: duckdb.AsyncDuckDB | null = null;
  let conn: duckdb.AsyncDuckDBConnection | null = null;
  let initPromise: Promise<void> | null = null;

  function buildWhere(search: string, filters: Record<string, string[]> = {}): string {
    const clauses: string[] = [];
    if (search.trim()) {
      const escaped = search.replace(/'/g, "''");
      clauses.push(`(G2expocode ILIKE '%${escaped}%' OR G2doi ILIKE '%${escaped}%')`);
    }

    for (const [col, values] of Object.entries(filters)) {
      if (!values || values.length === 0) continue;
      if (STRING_FILTER_COLUMNS.has(col)) {
        const quoted = values.map((v) => `'${v.replace(/'/g, "''")}'`).join(', ');
        clauses.push(`${col} IN (${quoted})`);
      } else {
        const nums = values.map(Number).filter((v) => !isNaN(v));
        if (nums.length > 0) {
          clauses.push(`${col} IN (${nums.join(', ')})`);
        }
      }
    }

    return clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  }

  async function init() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      const bundle = DUCKDB_BUNDLES.mvp;
      const worker = new Worker(bundle.mainWorker!);
      db = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(), worker);
      await db.instantiate(bundle.mainModule);
      conn = await db.connect();
      // Register via URL — DuckDB range-requests only the parquet footer + needed row groups
      await db.registerFileURL(FILE_NAME, GLODAP_URL, duckdb.DuckDBDataProtocol.HTTP, false);
    })();
    return initPromise;
  }

  async function fetchCount(search = '', filters: Record<string, string[]> = {}) {
    await init();
    const where = buildWhere(search, filters);
    const result = await conn!.query(
      `SELECT COUNT(*) AS n FROM read_parquet('${FILE_NAME}') ${where}`,
    );
    totalRecords.value = Number(result.toArray()[0].n);
  }

  async function fetchPage(limit: number, offset: number, search = '', filters: Record<string, string[]> = {}) {
    loading.value = true;
    error.value = null;
    try {
      await init();
      const where = buildWhere(search, filters);
      const result = await conn!.query(
        `SELECT * FROM read_parquet('${FILE_NAME}') ${where} LIMIT ${limit} OFFSET ${offset}`,
      );
      const schema = result.schema.fields.map((f: any) => f.name as string);
      rows.value = result.toArray().map((row: any) => {
        const out: GlodapRow = {};
        for (const col of schema) {
          out[col] = coerceValue(row[col]);
        }
        return out;
      });
    } catch (err) {
      console.error('Error fetching GLODAP page:', err);
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch distinct values for each of the given columns, excluding nulls
   * and the -9999 GLODAP missing sentinel. Used to populate FilterSelectors.
   */
  async function fetchFilterOptions(columns: string[]): Promise<Record<string, string[]>> {
    await init();
    const result: Record<string, string[]> = {};
    for (const col of columns) {
      const r = await conn!.query(
        `SELECT DISTINCT ${col} FROM read_parquet('${FILE_NAME}')
         WHERE ${col} IS NOT NULL AND ${col} != -9999
         ORDER BY ${col}`,
      );
      result[col] = r.toArray().map((row: any) => String(coerceValue(row[col])));
    }
    return result;
  }

  onUnmounted(async () => {
    if (conn) await conn.close();
    if (db) await db.terminate();
  });

  return { rows, totalRecords, loading, error, fetchPage, fetchCount, fetchFilterOptions };
}
