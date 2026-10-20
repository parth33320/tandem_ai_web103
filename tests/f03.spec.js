import { test, expect } from '@playwright/test';

test.describe('Feature Slice F-03 Custom Deck Creator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database for deterministic state
    await page.request.get('/api/reset');
  });

  test('POST deck with empty title -> assert 400 and error text visible in UI', async ({ page }) => {
    await page.goto('/decks');

    // Ensure page loaded
    await expect(page.locator('h1')).toContainText('Custom Decks');

    // Click submit button in DeckForm without entering a title
    const submitBtn = page.locator('.deck-form button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Assert inline error message is displayed
    const errorMsg = page.locator('.inline-error-text');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Title is required and must be under 80 characters.');
  });

  test('POST deck with valid title -> assert card appears in DeckList', async ({ page }) => {
    await page.goto('/decks');

    // Enter valid deck title
    const input = page.locator('.deck-title-input');
    await input.fill('JLPT N3 Vocabulary');

    // Submit form
    const submitBtn = page.locator('.deck-form button[type="submit"]');
    await submitBtn.click();

    // Expect auto-redirect to detail page /decks/:id
    await expect(page).toHaveURL(/\/decks\/\d+/);
    await expect(page.locator('.deck-title')).toContainText('JLPT N3 Vocabulary');

    // Navigate back to /decks to verify card in list
    await page.goto('/decks');
    const deckCard = page.locator('.deck-card', { hasText: 'JLPT N3 Vocabulary' });
    await expect(deckCard).toBeVisible();
  });

  test('DELETE deck -> assert card disappears', async ({ page }) => {
    await page.goto('/decks');

    // Create a deck to delete
    const input = page.locator('.deck-title-input');
    await input.fill('Deck To Delete');
    await page.locator('.deck-form button[type="submit"]').click();

    await expect(page).toHaveURL(/\/decks\/\d+/);

    // Navigate back to deck list
    await page.goto('/decks');
    const deckCard = page.locator('.deck-card', { hasText: 'Deck To Delete' });
    await expect(deckCard).toBeVisible();

    // Click delete button on deck card
    const deleteBtn = deckCard.locator('.delete-deck-btn');
    await deleteBtn.click();

    // Assert card is no longer in DOM
    await expect(deckCard).not.toBeVisible();
  });

  test('PATCH deck title -> assert updated title renders without page reload', async ({ page }) => {
    await page.goto('/decks');

    // Create initial deck
    const input = page.locator('.deck-title-input');
    await input.fill('Original Deck Title');
    await page.locator('.deck-form button[type="submit"]').click();

    await expect(page).toHaveURL(/\/decks\/\d+/);

    // Return to deck list
    await page.goto('/decks');
    const deckCard = page.locator('.deck-card', { hasText: 'Original Deck Title' });
    await expect(deckCard).toBeVisible();

    // Click Rename button
    const renameBtn = deckCard.locator('.edit-deck-btn');
    await renameBtn.click();

    // Locate edit input in the active editing card
    const editInput = page.locator('.edit-deck-title-input');
    await editInput.fill('Updated Deck Title');

    // Click Save button
    const saveBtn = page.locator('.save-title-btn');
    await saveBtn.click();

    // Assert updated title renders on card
    const updatedCard = page.locator('.deck-card', { hasText: 'Updated Deck Title' });
    await expect(updatedCard).toBeVisible();
  });

  test('Auto-generated starter deck loads on first visit', async ({ page, context }) => {
    // Clear localStorage before visiting page to simulate first visit
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
    await page.goto('/decks');

    // Starter deck card should auto-generate
    const starterCard = page.locator('.deck-card', { hasText: 'Starter Deck' }).first();
    await expect(starterCard).toBeVisible();

    // Click view words on starter deck
    const viewBtn = starterCard.locator('.view-deck-btn');
    await viewBtn.click();

    // Assert 5 seed words are rendered in table
    const rows = page.locator('table.deck-words-table tbody tr');
    await expect(rows).toHaveCount(5);
  });
});
