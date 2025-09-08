/**
 * Constants are exported here so they can be mocked more easily
 * in Jest tests as import.meta.env is not available in Jest when
 * using Vite
 */

const {
  MODE: MODE,
  DEV: DEV,
  PROD: PROD,
  VITE_POLYGON_API_KEY: POLYGON_API_KEY,
} = import.meta.env;

export { MODE, DEV, PROD, POLYGON_API_KEY };
