declare module "*.jpg" {
  const value: any;
  export = value;
}

interface ImportMetaEnv {
  VITE_PORT?: string;
  VITE_AUTH_TOKEN?: string;
}
