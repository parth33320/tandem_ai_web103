import { test, expect } from '@playwright/test';
import pool from '../server/config/db.js';

test.describe('Feature Slice F-10 Passive Lifeline Power-Ups Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database to clean state
    await page.request.get('http://localhost:3000/api/reset');
  });

  test('POST /api/rooms/:roomId/lifelines/use with mismatched lifelineType returns 400', async ({ page }) => {
    // Mock login to obtain session
    const loginRes = await page.request.post('http://localhost:3000/auth/mock-login', {
      data: { username: 'LifelineTester1', github_id: 'gh_lifeline_101' }
    });
    expect(loginRes.status()).toBe(200);

    // Create room
    const roomRes = await page.request.post('http://localhost:3000/api/rooms');
    expect(roomRes.status()).toBe(201);
    const room = await roomRes.json();

    // Attempt to use lifeline when slot is empty or mismatched
    const useRes = await page.request.post(`http://localhost:3000/api/rooms/${room.id}/lifelines/use`, {
      data: { lifelineType: 'Fifty_Fifty' }
    });

    expect(useRes.status()).toBe(400);
    const body = await useRes.json();
    expect(body.error).toBeDefined();
  });

  test('POST /api/rooms/:roomId/lifelines/use with valid passive_slot clears passive_slot and returns 200', async ({ page }) => {
    // Mock login
    const loginRes = await page.request.post('http://localhost:3000/auth/mock-login', {
      data: { username: 'LifelineTester2', github_id: 'gh_lifeline_102' }
    });
    expect(loginRes.status()).toBe(200);

    // Create room
    const roomRes = await page.request.post('http://localhost:3000/api/rooms');
    expect(roomRes.status()).toBe(201);
    const room = await roomRes.json();

    // Get user id from db
    const userRes = await pool.query(`SELECT id FROM users WHERE github_id = $1`, ['gh_lifeline_102']);
    const userId = userRes.rows[0].id;

    // Set passive_slot = 'Fifty_Fifty' and offensive_slot = 'Ink_Splat' in inventory
    await pool.query(
      `INSERT INTO inventory (room_id, user_id, offensive_slot, passive_slot, updated_at)
       VALUES ($1, $2, 'Ink_Splat', 'Fifty_Fifty', NOW())
       ON CONFLICT (room_id, user_id)
       DO UPDATE SET offensive_slot = 'Ink_Splat', passive_slot = 'Fifty_Fifty'`,
      [room.id, userId]
    );

    // Use Fifty_Fifty lifeline
    const useRes = await page.request.post(`http://localhost:3000/api/rooms/${room.id}/lifelines/use`, {
      data: { lifelineType: 'Fifty_Fifty' }
    });

    expect(useRes.status()).toBe(200);
    const body = await useRes.json();
    expect(body.success).toBe(true);

    // Verify passive_slot is cleared while offensive_slot remains
    const invRes = await page.request.get(`http://localhost:3000/api/rooms/${room.id}/inventory?user_id=${userId}`);
    expect(invRes.status()).toBe(200);
    const inventory = await invRes.json();
    expect(inventory.passive_slot).toBeNull();
    expect(inventory.offensive_slot).toBe('Ink_Splat');
  });

  test('GET /api/rooms/:roomId/inventory shows inventory row with both offensive_slot and passive_slot', async ({ page }) => {
    // Mock login
    const loginRes = await page.request.post('http://localhost:3000/auth/mock-login', {
      data: { username: 'LifelineTester3', github_id: 'gh_lifeline_103' }
    });
    expect(loginRes.status()).toBe(200);

    // Create room
    const roomRes = await page.request.post('http://localhost:3000/api/rooms');
    expect(roomRes.status()).toBe(201);
    const room = await roomRes.json();

    // Get user id from db
    const userRes = await pool.query(`SELECT id FROM users WHERE github_id = $1`, ['gh_lifeline_103']);
    const userId = userRes.rows[0].id;

    // Set both offensive_slot and passive_slot
    await pool.query(
      `INSERT INTO inventory (room_id, user_id, offensive_slot, passive_slot, updated_at)
       VALUES ($1, $2, 'Smoke_Screen', 'Hint_Provider', NOW())
       ON CONFLICT (room_id, user_id)
       DO UPDATE SET offensive_slot = 'Smoke_Screen', passive_slot = 'Hint_Provider'`,
      [room.id, userId]
    );

    // Query inventory
    const invRes = await page.request.get(`http://localhost:3000/api/rooms/${room.id}/inventory?user_id=${userId}`);
    expect(invRes.status()).toBe(200);
    const inventory = await invRes.json();

    expect(inventory.offensive_slot).toBe('Smoke_Screen');
    expect(inventory.passive_slot).toBe('Hint_Provider');
  });
});
