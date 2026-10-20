import { test, expect } from '@playwright/test';

test.describe('Tracer Bullet Slice TB-01 E2E Tests', () => {
  test('HomePage navigates to /play and QuestionCard renders', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome to Tandem');

    // Click Play button to navigate to /play
    await page.getByRole('button', { name: 'Play', exact: true }).click();
    await expect(page).toHaveURL('/play');

    // Assert .question-card exists on /play
    const questionCard = page.locator('.question-card');
    await expect(questionCard).toBeVisible();
  });

  test('QuestionCard handles wrong and correct answer interactions inline', async ({ page }) => {
    // Reset DB for clean state
    await page.request.get('/api/reset');

    await page.goto('/play');
    await expect(page.locator('.question-card')).toBeVisible();

    // 1. Click wrong answer and verify .wrong class
    const wrongButton = page.locator('button.option-button[data-correct="false"]').first();
    await expect(wrongButton).toBeVisible();
    await wrongButton.click();
    await expect(wrongButton).toHaveClass(/wrong/);

    // 2. Click "Next" button in RevealCard modal to load another word
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.locator('.question-card')).toBeVisible();

    // 3. Click correct answer and verify .correct class
    const correctButton = page.locator('button.option-button[data-correct="true"]').first();
    await expect(correctButton).toBeVisible();
    await correctButton.click();
    await expect(correctButton).toHaveClass(/correct/);
  });
});
