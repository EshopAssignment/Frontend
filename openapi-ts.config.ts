import { defineConfig } from '@hey-api/openapi-ts';
export default defineConfig({
  input: 'https://localhost:7152/openapi.json',    
  output: 'src/api',
  client: 'fetch',                  
  useEnums: true,
  exportCore: true,
  schemas: true,
  prettier: true,
});