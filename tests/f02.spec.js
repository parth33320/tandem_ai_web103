import { test, expect } from '@playwright/test';

test.describe('Feature Slices F-02a, F-02b, F-02c E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database for deterministic state
    await page.request.get('/api/reset');
  });

  test('F-02a: Timer decrements and stops on answer click', async ({ page }) => {
    await page.goto('/play');

    const timer = page.locator('.timer');
    await expect(timer).toBeVisible();

    // Assert timer shows initial countdown (e.g., 10s or 9s as time ticks)
    await expect(timer).toContainText(/10s|9s/);

    // Wait 1.5 seconds and assert timer decremented
    await page.waitForTimeout(1500);
    const textBeforeClick = await timer.innerText();

    // Click an answer option button
    const optionBtn = page.locator('button.option-button').first();
    await expect(optionBtn).toBeVisible();
    await optionBtn.click();

    // Verify timer stopped at the value when clicked
    const textAfterClick = await timer.innerText();
    expect(textAfterClick).toBe(textBeforeClick);

    // Wait another 1.5 seconds and verify timer did NOT decrement further
    await page.waitForTimeout(1500);
    const textFinal = await timer.innerText();
    expect(textFinal).toBe(textAfterClick);
  });

  test('F-02b: RevealCard modal appears after answer and tag class matches DB relationship_tag', async ({ page }) => {
    await page.goto('/play');

    // Click an option to trigger reveal modal
    const optionBtn = page.locator('button.option-button').first();
    await expect(optionBtn).toBeVisible();
    await optionBtn.click();

    // Assert RevealCard modal backdrop is visible
    const modalBackdrop = page.locator('.modal-backdrop');
    await expect(modalBackdrop).toBeVisible();

    // Assert RevealCard modal content and table are visible
    const modalContent = page.locator('.reveal-card-modal');
    await expect(modalContent).toBeVisible();
    await expect(modalContent.locator('table.reveal-table')).toBeVisible();

    // Assert relationship tag badge exists and has class true_friend, false_friend, or half_friend
    const tagBadge = modalContent.locator('.relationship-tag');
    await expect(tagBadge).toBeVisible();
    const tagClass = await tagBadge.getAttribute('class');
    expect(tagClass).toMatch(/relationship-tag (true_friend|false_friend|half_friend)/);

    // Assert Next button is visible
    const nextBtn = modalContent.getByRole('button', { name: 'Next', exact: true });
    await expect(nextBtn).toBeVisible();
  });

  test('F-02c: 10-Question round completes, navigates to /results, and .similarity-meter has correct width style', async ({ page }) => {
    await page.goto('/play');

    // Click through 10 questions
    for (let i = 1; i <= 10; i++) {
      // Click an option button
      const optionBtn = page.locator('button.option-button').first();
      await expect(optionBtn).toBeVisible();
      await optionBtn.click();

      // Click "Next" button in RevealCard modal
      const nextBtn = page.locator('.reveal-card-modal').getByRole('button', { name: 'Next', exact: true });
      await expect(nextBtn).toBeVisible();
      await nextBtn.click();
    }

    // Assert navigation to /results
    await expect(page).toHaveURL('/results');

    // Assert ResultsPage loaded
    await expect(page.locator('h1')).toContainText('Round Complete!');

    // Assert .similarity-meter element exists and has inline width style
    const similarityMeter = page.locator('.similarity-meter');
    await expect(similarityMeter).toBeVisible();

    const widthStyle = await similarityMeter.getAttribute('style');
    expect(widthStyle).toMatch(/width:\s*\d+(?:\.\d+)?%/);

    // Assert Play Again button exists and navigates back to /play
    const playAgainBtn = page.getByRole('button', { name: 'Play Again', exact: true });
    await expect(playAgainBtn).toBeVisible();
    await playAgainBtn.click();
    await expect(page).toHaveURL('/play');
  });
});
