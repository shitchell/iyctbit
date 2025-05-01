// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('If You Could Go Back In Time Game', () => {
  
  test('should load the game page', async ({ page }) => {
    // Navigate to the game page
    await page.goto('/html/index.html');
    
    // Check if the title is correct
    const title = await page.title();
    expect(title).toBe('If You Could Go Back In Time');
    
    // Check if heading is present
    const heading = await page.locator('h1').textContent();
    expect(heading).toContain('If You Could Go Back In Time');
  });
  
  test('should show game output in the UI', async ({ page }) => {
    // Mock window.prompt to always return '1' (first choice)
    await page.addInitScript(() => {
      window.prompt = () => '1';
    });
    
    // Navigate to the game page
    await page.goto('/html/index.html');
    
    // Wait for game log to show some content
    await page.waitForSelector('#game-log:not(:empty)', { timeout: 10000 });
    
    // Verify game log has content
    const logContent = await page.locator('#game-log').textContent();
    expect(logContent.length).toBeGreaterThan(0);
    expect(logContent).toContain('Starting a new game');
  });
  
  test('should handle player choice through UI', async ({ page }) => {
    // Setup a console message listener
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });
    
    // Mock window.prompt to always return '1' (first choice)
    await page.addInitScript(() => {
      window.prompt = () => '1';
    });
    
    // Navigate to the game page
    await page.goto('/html/index.html');
    
    // Wait for game log to show content
    await page.waitForSelector('#game-log:not(:empty)', { timeout: 10000 });
    
    // Wait for some time to let game process choices
    await page.waitForTimeout(1000);
    
    // Check that game shows question text in the log
    const logContent = await page.locator('#game-log').textContent();
    
    // Game should show at least one question (the one answered)
    expect(logContent).toMatch(/(?:How would you|What would you|Can you)/);
    
    // Game should also show some choices or responses
    expect(logContent).toMatch(/(?:1:|2:|3:|Choice)/);
  });
  
  // Test debug mode
  test('should show debug panel when debug is enabled', async ({ page }) => {
    // Navigate to the game page with debug mode
    await page.goto('/html/index.html?debug=true');
    
    // Debug panel should be visible
    await expect(page.locator('#debug-panel')).toBeVisible();
    
    // Regular game panel should also be visible
    await expect(page.locator('#game-log')).toBeVisible();
  });
});