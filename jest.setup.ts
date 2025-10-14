import '@testing-library/jest-dom';

// Mock para import.meta.env
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: 'http://localhost:3000'
      }
    }
  }
});