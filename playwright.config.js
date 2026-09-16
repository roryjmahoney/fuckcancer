import { defineConfig } from '@playwright/test';

const CI = !!process.env.CI;

export default defineConfig({
 testDir:'./tests/browser',
 // In CI a committed .only would silently shrink the run to one test and still report green.
 forbidOnly:CI,
 retries:CI?2:0,
 timeout:60_000,
 use:{
  baseURL:'http://127.0.0.1:5173',
  trace:'on-first-retry',
  launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{}
 },
 webServer:{
  // Bind to loopback: the `dev` script's --host 0.0.0.0 would expose the dev server
  // on every interface of whatever machine runs the tests.
  command:'npm run dev -- --port 5173 --host 127.0.0.1',
  url:'http://127.0.0.1:5173',
  // Never reuse a stray server in CI — it could be serving a stale build.
  reuseExistingServer:!CI,
  timeout:120_000
 },
 reporter:CI?[['list'],['html',{open:'never'}]]:'list'
});
