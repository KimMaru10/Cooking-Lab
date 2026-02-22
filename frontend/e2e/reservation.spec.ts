import { test, expect } from '@playwright/test';
import { testUsers, login } from './fixtures';

test.describe('予約フロー', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testUsers.student);
  });

  test('レッスン一覧が表示される', async ({ page }) => {
    await page.goto('/lessons');

    await expect(page.locator('h1')).toContainText('レッスン一覧');
  });

  test('レッスン詳細ページが表示される', async ({ page }) => {
    await page.goto('/lessons');

    // 最初のレッスンカードをクリック
    await page.locator('a[href^="/lessons/"]').first().click();

    // レッスン詳細ページが表示される
    await expect(page.locator('text=レッスン内容')).toBeVisible();
    await expect(page.locator('text=開催スケジュール')).toBeVisible();
  });

  test('予約確認ページに遷移できる', async ({ page }) => {
    await page.goto('/lessons');

    // 最初のレッスンをクリック
    await page.locator('a[href^="/lessons/"]').first().click();

    // 予約ボタンをクリック（満席でない場合）
    const reserveButton = page.locator('button:has-text("予約する")').first();

    if (await reserveButton.isVisible()) {
      await reserveButton.click();

      // 予約確認ページに遷移
      await expect(page).toHaveURL(/\/reservations\/confirm/);
      await expect(page.locator('text=予約内容の確認')).toBeVisible();
    }
  });
});

test.describe('キャンセルフロー', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testUsers.student);
  });

  test('マイページで予約一覧が表示される', async ({ page }) => {
    await page.goto('/mypage');

    await expect(page.locator('text=予約履歴')).toBeVisible();
  });

  test('予約をキャンセルできる', async ({ page }) => {
    await page.goto('/mypage');

    // キャンセルボタンが存在する場合
    const cancelButton = page.locator('button:has-text("予約をキャンセル")').first();

    if (await cancelButton.isVisible()) {
      await cancelButton.click();

      // 確認モーダルが表示される
      await expect(page.locator('text=予約をキャンセルしますか')).toBeVisible();

      // キャンセルを確定
      await page.locator('button:has-text("キャンセルする")').click();

      // 成功メッセージまたは状態の更新を確認
      await expect(page.locator('text=キャンセル済み')).toBeVisible();
    }
  });
});
