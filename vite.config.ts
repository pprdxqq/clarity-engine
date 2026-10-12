import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  // GitHub Pages serves this repository below /clarity-engine/.
  base: '/clarity-engine/',
  plugins: [react()],
  test: { environment: 'jsdom' },
});
