import { test, expect } from '@playwright/test';

test.describe('Feature Slice F-11 Cinematic Polish & Final Rubric Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database and clear storage for clean test state
    await page.request.get('/api/reset');
    await page.request.post('/auth/mock-login');
  });

  test('RevealCard shows relationship tag after answer submission', async ({ page }) => {
    await page.goto('/play');

    // Wait for QuestionCard to load
    const optionBtn = page.locator('.choice-btn').first();
    await expect(optionBtn).toBeVisible();

    // Submit answer
    await optionBtn.click();

    // RevealCard modal should open with relationship-tag visible
    const revealCard = page.locator('.reveal-card-modal');
    await expect(revealCard).toBeVisible();

    const tagBadge = revealCard.locator('.relationship-tag');
    await expect(tagBadge).toBeVisible();

    const tagText = await tagBadge.textContent();
    expect(tagText).toMatch(/True Friend|False Friend|Half Friend/);
  });

  test('ProfilePage avatar save PATCH /api/me/avatar returns 200', async ({ page }) => {
    await page.goto('/profile');

    // Verify avatar customization form rendered
    const colorInput = page.locator('.avatar-color-input');
    await expect(colorInput).toBeVisible();

    const bgInput = page.locator('.avatar-bg-input');
    await expect(bgInput).toBeVisible();

    // Change avatar colors
    await colorInput.fill('#ff0000');
    await bgInput.fill('#000000');

    // Click Save Avatar Colors button
    const saveBtn = page.locator('.save-avatar-btn');
    await saveBtn.click();

    // Expect success toast message
    const toastMsg = page.locator('div[role="status"], .react-hot-toast');
    await expect(toastMsg).toBeVisible();

    // Verify API returned updated user colors via GET /api/me
    const meRes = await page.request.get('/api/me');
    expect(meRes.status()).toBe(200);
    const body = await meRes.json();
    expect(body.user.avatar_color).toBe('#ff0000');
    expect(body.user.avatar_bg).toBe('#000000');
  });

  test('NavBar mute button stores muted state in localStorage', async ({ page }) => {
    await page.goto('/');

    const muteBtn = page.locator('.mute-btn');
    await expect(muteBtn).toBeVisible();

    // Initially sound is on
    await expect(muteBtn).toContainText('Sound On');

    // Click mute button
    await muteBtn.click();
    await expect(muteBtn).toContainText('Muted');

    // Verify localStorage key muted === 'true'
    const isMuted = await page.evaluate(() => localStorage.getItem('muted'));
    expect(isMuted).toBe('true');

    // Click again to unmute
    await muteBtn.click();
    await expect(muteBtn).toContainText('Sound On');

    const isMutedAfter = await page.evaluate(() => localStorage.getItem('muted'));
    expect(isMutedAfter).toBe('false');
  });
});
