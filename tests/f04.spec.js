import { test, expect } from '@playwright/test';

test.describe('Feature Slice F-04 GitHub OAuth & Missed Words API Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database to clean state
    await page.request.get('/api/reset');
  });

  test('unauthenticated GET /api/missed-words returns 401', async ({ request }) => {
    const response = await request.get('/api/missed-words');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  test('unauthenticated POST /api/decks returns 401', async ({ request }) => {
    const response = await request.post('/api/decks', {
      data: { title: 'Unauthorized Deck' }
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  test('GET /api/me with no session returns { user: null } or 401', async ({ request }) => {
    const response = await request.get('/api/me');
    expect([200, 401]).toContain(response.status());
    const body = await response.json();
    if (response.status() === 200) {
      expect(body.user).toBeNull();
    } else {
      expect(body.error).toBeDefined();
    }
  });

  test('mock login allows authenticated GET /api/missed-words and POST /api/decks', async ({ page }) => {
    // Use page context to maintain session cookie
    const loginRes = await page.request.post('/auth/mock-login', {
      data: { username: 'Test OAuth User', github_id: 'gh_99999' }
    });
    expect(loginRes.status()).toBe(200);

    // Check GET /api/me returns logged in user
    const meRes = await page.request.get('/api/me');
    expect(meRes.status()).toBe(200);
    const meBody = await meRes.json();
    expect(meBody.user).not.toBeNull();
    expect(meBody.user.username).toBe('Test OAuth User');

    // Authenticated POST /api/decks succeeds
    const deckRes = await page.request.post('/api/decks', {
      data: { title: 'Authenticated User Deck' }
    });
    expect(deckRes.status()).toBe(201);

    // Authenticated GET /api/missed-words succeeds
    const missedRes = await page.request.get('/api/missed-words');
    expect(missedRes.status()).toBe(200);
    const missedBody = await missedRes.json();
    expect(Array.isArray(missedBody)).toBe(true);
  });

  test('NavBar displays Login with GitHub when unauthenticated', async ({ page }) => {
    await page.goto('/');
    const loginBtn = page.locator('.login-github-btn');
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toHaveAttribute('href', '/auth/github');
  });
});
