import { test, expect } from '@playwright/test';
import { testUsers, login } from './fixtures';

test.describe('認証フロー', () => {
  test('ログインページが表示される', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('h1')).toContainText('ログイン');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('正しい認証情報でログインできる', async ({ page }) => {
    await login(page, testUsers.student);

    // マイページリンクが表示されることを確認
    await expect(page.locator('a[href="/mypage"]')).toBeVisible();
  });

  test('間違った認証情報でログインできない', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // エラーメッセージが表示される
    await expect(page.locator('text=メールアドレスまたはパスワードが正しくありません')).toBeVisible();
  });

  test('未ログイン時にマイページへアクセスするとログインページにリダイレクトされる', async ({ page }) => {
    await page.goto('/mypage');

    // ログインページにリダイレクト
    await expect(page).toHaveURL('/login');
  });

  test('ログイン後にマイページが表示される', async ({ page }) => {
    await login(page, testUsers.student);
    await page.goto('/mypage');

    await expect(page.locator('h1')).toContainText('マイページ');
    await expect(page.locator('text=チケット残数')).toBeVisible();
  });
});
