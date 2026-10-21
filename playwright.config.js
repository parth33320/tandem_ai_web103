import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'node server/index.js',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
    },
    {
      command: 'npx vite --config client/vite.config.js',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
    },
  ],
});
