// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({ // The configuration for Playwright tests is defined using the defineConfig function, which allows us to specify various settings and options for running the tests
  testDir: './tests',
  retries: 1, // The number of times a test will be retried if it fails
  workers: 3, // The number of workers to use for running tests in parallel
  timeout: 30 * 1000,// Maximum time one test can run for we use this to set a timeout of 40 seconds for each test case to prevent tests from running indefinitely
  expect: {
    timeout: 5000// Maximum time expect() should wait for the condition or assertion to be met
  },
  reporter: [['html', { open: 'always', outputFolder: 'playwright-report' }]],// The test results will be reported in HTML format and opened automatically in the default browser after the run

  use: {
    actionTimeout: 10 * 1000,// Maximum time one action can run for
    navigationTimeout: 30 * 1000,// Maximum time one navigation can run for
    browserName: 'chromium',// The browser to be used for testing is set to Chromium, which is the open-source version of Google Chrome
    headless: false,// The headless mode is set to false, which means the browser will be launched with a visible UI for debugging and visual verification of the tests
    screenshot: 'on',// Screenshots are enabled for debugging purposes
    trace: 'retain-on-failure',// Traces are retained only for failed tests and it can be on, off or retain-on-failure

  }
  
});

module.exports = config; // The configuration object is exported so that it can be used by Playwright when running the tests
