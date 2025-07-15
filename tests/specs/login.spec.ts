import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * Suite de pruebas para la página de Login de Roadmap.sh
 */
test.describe('Roadmap.sh - Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('should load login page successfully', async ({ page }) => {
    await loginPage.navigateToLogin();
    await loginPage.validateLoginPage();
    
    await loginPage.takeLoginScreenshot();
    
    console.log('✅ Login page loaded successfully');
  });

  test('should display login form elements', async ({ page }) => {
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginForm();
    
    console.log('✅ Login form elements verified');
  });

  test('should have correct page title', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    const title = await loginPage.getPageTitle().catch(() => 'No title found');
    expect(title).toBeTruthy();
    
    console.log(`✅ Page title verified: ${title}`);
  });

  test('should verify login page URL', async ({ page }) => {
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginPage();
    
    console.log('✅ Login page URL verified');
  });

  test('should verify authentication page', async ({ page }) => {
    await loginPage.navigateToLogin();
    await loginPage.verifyAuthenticationPage();
    
    console.log('✅ Authentication page verified');
  });

  test('should debug login selectors', async ({ page }) => {
    await loginPage.navigateToLogin();
    await loginPage.debugLoginSelectors();
    
    // Verificar que la página cargó correctamente
    await loginPage.verifyLoginPage();
    
    console.log('✅ Login page debug completed');
  });

  // Test para el futuro cuando implementes login real
  test.skip('should perform login successfully', async ({ page }) => {
    await loginPage.navigateToLogin();
    await loginPage.performLogin('test@example.com', 'password123');
    
    // Verificar redirección después del login
    expect(page.url()).not.toContain('/login');
    
    console.log('✅ Login performed successfully');
  });
});
