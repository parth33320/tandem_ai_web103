import { test, expect } from '@playwright/test';
import { getDropProbability } from '../server/utils/itemDrop.js';

test.describe('Feature Slice F-09 Mario Kart RNG Weapons & Rubber-Banding Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database to clean state
    await page.request.get('http://localhost:3000/api/reset');
  });

  test('POST /api/rooms/:roomId/weapons/use with no active weapon returns 400', async ({ page }) => {
    // Mock login to obtain session
    const loginRes = await page.request.post('http://localhost:3000/auth/mock-login', {
      data: { username: 'WeaponTester', github_id: 'gh_weapon_123' }
    });
    expect(loginRes.status()).toBe(200);

    // Create a room first
    const roomRes = await page.request.post('http://localhost:3000/api/rooms');
    expect(roomRes.status()).toBe(201);
    const room = await roomRes.json();

    // Attempt to use weapon without having one in inventory
    const useRes = await page.request.post(`http://localhost:3000/api/rooms/${room.id}/weapons/use`, {
      data: { weaponType: 'Ink_Splat', targetUserId: 2 }
    });

    expect(useRes.status()).toBe(400);
    const body = await useRes.json();
    expect(body.error).toBeDefined();
  });

  test('GET /api/rooms/:roomId/weapons/active returns empty array initially', async ({ page }) => {
    // Create a room first
    const loginRes = await page.request.post('http://localhost:3000/auth/mock-login', {
      data: { username: 'ActiveTester', github_id: 'gh_active_123' }
    });
    expect(loginRes.status()).toBe(200);

    const roomRes = await page.request.post('http://localhost:3000/api/rooms');
    expect(roomRes.status()).toBe(201);
    const room = await roomRes.json();

    // Query active weapons
    const activeRes = await page.request.get(`http://localhost:3000/api/rooms/${room.id}/weapons/active`);
    expect(activeRes.status()).toBe(200);
    const activeEvents = await activeRes.json();

    expect(Array.isArray(activeEvents)).toBe(true);
    expect(activeEvents.length).toBe(0);
  });

  test('itemDrop assigns higher probability to lower-ranked players', () => {
    const totalPlayers = 10;

    const rank1Prob = getDropProbability(1, totalPlayers);
    const rank2Prob = getDropProbability(2, totalPlayers);
    const rank5Prob = getDropProbability(5, totalPlayers);
    const rank8Prob = getDropProbability(8, totalPlayers);
    const rank10Prob = getDropProbability(10, totalPlayers);

    // Rank 1 (Leader): 5%
    expect(rank1Prob).toBe(0.05);

    // Rank 2: 20%
    expect(rank2Prob).toBe(0.20);

    // Rank 5 (Top 50% bucket): 40%
    expect(rank5Prob).toBe(0.40);

    // Rank 8 (Bottom 50% bucket): 65%
    expect(rank8Prob).toBe(0.65);

    // Rank 10 (Last place): 85%
    expect(rank10Prob).toBe(0.85);

    // Verify monotonic increase for lower ranks
    expect(rank1Prob).toBeLessThan(rank2Prob);
    expect(rank2Prob).toBeLessThan(rank5Prob);
    expect(rank5Prob).toBeLessThan(rank8Prob);
    expect(rank8Prob).toBeLessThan(rank10Prob);
  });
});
