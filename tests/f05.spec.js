import { test, expect } from '@playwright/test';

test.describe('Feature Slice F-05 Split Direction Leaderboard & Dynamic Option Restriction E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database for deterministic state
    await page.request.get('http://localhost:3000/api/reset');
  });

  test('Leaderboard toggle changes active direction label', async ({ page }) => {
    await page.goto('/leaderboard');

    // Assert initial active direction label is Chinese to Japanese
    const directionLabel = page.locator('.active-direction-label');
    await expect(directionLabel).toBeVisible();
    await expect(directionLabel).toContainText('Chinese to Japanese');

    // Locate and click toggle switch label
    const toggleLabel = page.locator('label.toggle-switch');
    await expect(toggleLabel).toBeVisible();
    await toggleLabel.click();

    // Assert active direction label changed to Japanese to Chinese
    await expect(directionLabel).toContainText('Japanese to Chinese');

    // Toggle back
    await toggleLabel.click();
    await expect(directionLabel).toContainText('Chinese to Japanese');
  });

  test('POST /api/scores with direction="invalid" returns 400', async ({ page }) => {
    // Authenticate test session first via mock login
    const loginRes = await page.request.post('http://localhost:3000/api/auth/mock-login', {
      data: { username: 'Tester', github_id: 'gh_test_123' }
    });
    expect(loginRes.ok()).toBeTruthy();

    // Make API request with invalid direction
    const response = await page.request.post('http://localhost:3000/api/scores', {
      data: {
        direction: 'invalid',
        score: 80,
        similarity_pct: 50
      }
    });

    // Assert 400 Bad Request
    expect(response.status()).toBe(400);

    const json = await response.json();
    expect(json.error).toMatch(/Invalid direction/i);
  });

  test('After 3 guest rounds the Play button has attribute disabled and shows login prompt text', async ({ page }) => {
    // Set localStorage tandem_guest_rounds = 3 to simulate 3 completed guest rounds
    await page.addInitScript(() => {
      window.localStorage.setItem('tandem_guest_rounds', '3');
    });

    await page.goto('/');

    // Assert Play button has attribute disabled
    const playButton = page.locator('button.play-button');
    await expect(playButton).toBeVisible();
    await expect(playButton).toBeDisabled();

    // Assert login prompt text is displayed
    const loginPrompt = page.locator('.login-prompt');
    await expect(loginPrompt).toBeVisible();
    await expect(loginPrompt).toContainText("You've played 3 free rounds. Log in to keep playing.");
  });
});
