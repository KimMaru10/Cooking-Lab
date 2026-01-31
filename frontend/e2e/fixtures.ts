import { test as base, expect } from '@playwright/test';

// テスト用のユーザー情報
export const testUsers = {
  student: {
    email: 'test@example.com',
    password: 'password',
    name: 'テストユーザー',
  },
  instructor: {
    email: 'instructor@example.com',
    password: 'password',
    name: '講師ユーザー',
  },
  staff: {
    email: 'staff@example.com',
    password: 'password',
    name: '運営スタッフ',
  },
};

// カスタムフィクスチャ
export const test = base.extend<{
  authenticatedPage: ReturnType<typeof base.page>;
}>({
  authenticatedPage: async ({ page }, use) => {
    // ログイン処理
    await page.goto('/login');
    await page.fill('input[type="email"]', testUsers.student.email);
    await page.fill('input[type="password"]', testUsers.student.password);
    await page.click('button[type="submit"]');

    // ログイン完了を待機
    await page.waitForURL('/', { timeout: 10000 });

    await use(page);
  },
});

export { expect };

// ヘルパー関数
export async function login(
  page: ReturnType<typeof base.page>,
  user: { email: string; password: string }
) {
  await page.goto('/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/', { timeout: 10000 });
}

export async function logout(page: ReturnType<typeof base.page>) {
  // ヘッダーのログアウトボタンをクリック
  await page.click('button:has-text("ログアウト")');
  await page.waitForURL('/');
}
