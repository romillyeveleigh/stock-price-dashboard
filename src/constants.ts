const {
    MODE: ENVIRONMENT,
    NODE_ENV: NODE_ENV,
    DEV: DEV,
    PROD: PROD,
    VITE_POLYGON_API_KEY: POLYGON_API_KEY,
    VITE_USER_NODE_ENV: USER_NODE_ENV,

  } = import.meta.env;

  export {
    ENVIRONMENT,
    NODE_ENV,
    DEV,
    PROD,
    POLYGON_API_KEY,
    USER_NODE_ENV,
  };