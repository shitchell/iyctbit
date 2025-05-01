# Testing Documentation

This directory contains tests for the "If You Could Go Back In Time" game.

## Test Structure

- `unit/`: Unit tests using Jest + jsdom
- `e2e/`: End-to-end tests using Playwright

## Running Tests

### Prerequisites

Before running tests, install the dependencies:

```bash
npm install
```

For Playwright tests, you'll need to install the browsers:

```bash
npx playwright install
```

### Unit Tests

Run all unit tests:

```bash
npm test
```

Run with watch mode (for development):

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### End-to-End Tests

Run all E2E tests headlessly:

```bash
npm run test:e2e
```

Run with UI for debugging:

```bash
npm run test:e2e:ui
```

## Development Server

Start a development server (with hot reloading disabled):

```bash
npm run dev
```

## Logging

The game includes a built-in logging system that can be controlled through URL parameters:

- `?logLevel=DEBUG` - Show all logs
- `?logLevel=INFO` - Show info, warnings, and errors (default)
- `?logLevel=WARN` - Show only warnings and errors
- `?logLevel=ERROR` - Show only errors
- `?logLevel=NONE` - Hide all logs

Example:
```
http://localhost:3000/html/index.html?logLevel=DEBUG
```

## Writing Tests

### Unit Tests

Unit tests focus on testing individual components and modules in isolation. Place your test files in `/tests/unit/` with a `.test.js` extension.

Example:

```javascript
import { Settings } from '../../../html/js/engine/Settings.js';

describe('Settings', () => {
  test('should initialize with default values', () => {
    const settings = new Settings();
    expect(settings.numCoreQuestions).toBe(5);
  });
});
```

### E2E Tests

E2E tests verify the game works end-to-end in a real browser environment. Place your test files in `/tests/e2e/` with a `.spec.js` extension.

Example:

```javascript
test('should load the game page', async ({ page }) => {
  await page.goto('/html/index.html');
  const title = await page.title();
  expect(title).toBe('If You Could Go Back In Time');
});
```

## Mocking

For browser APIs and window objects, use Jest's mocking capabilities for unit tests and Playwright's `page.addInitScript()` for E2E tests.

## Coverage

Unit test coverage reports are generated in the `/coverage` directory after running `npm run test:coverage`.