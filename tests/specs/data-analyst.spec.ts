import { test, expect } from '@playwright/test';
import { DataAnalystPage } from '../pages/DataAnalystPage';

/**
 * Suite de pruebas para la página de Data Analyst
 */
test.describe('Roadmap.sh - Data Analyst Page', () => {
  let dataAnalystPage: DataAnalystPage;

  test.beforeEach(async ({ page }) => {
    dataAnalystPage = new DataAnalystPage(page);
  });

  test('should display correct title', async ({ page }) => {
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.validateDataAnalystTitle();
    
    // Verificar URL
    await dataAnalystPage.verifyDataAnalystPage();
    
    console.log('✅ Data Analyst page title validation successful');
  });

  test('should display all page elements', async ({ page }) => {
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.verifyPageElements();
    
    await dataAnalystPage.takeDataAnalystScreenshot();
    
    console.log('✅ Data Analyst page elements verified');
  });

  test('should have login button visible', async ({ page }) => {
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.verifyLoginButtonExists();
    
    console.log('✅ Login button found on Data Analyst page');
  });

  test('should navigate to login when clicking login button', async ({ page }) => {
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.clickLoginButton();
    
    // Verificar que navegó a una página de autenticación
    const currentUrl = page.url();
    const isAuthPage = currentUrl.includes('login') || 
                      currentUrl.includes('signin') ||
                      currentUrl.includes('auth') ||
                      currentUrl.includes('account');
    
    expect(isAuthPage).toBe(true);
    
    console.log('✅ Successfully navigated to authentication page');
  });

  test('should handle login click robustly', async ({ page }) => {
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.clickLoginButtonRobust();
    
    // Verificar navegación exitosa
    const currentUrl = page.url();
    const isAuthPage = currentUrl.includes('login') || 
                      currentUrl.includes('signin') ||
                      currentUrl.includes('auth') ||
                      currentUrl.includes('account');
    
    expect(isAuthPage).toBe(true);
    
    console.log('✅ Robust login navigation successful');
  });

  test('should get correct title text', async ({ page }) => {
    await dataAnalystPage.navigateToDataAnalyst();
    
    const titleText = await dataAnalystPage.getTitleText();
    expect(titleText.toLowerCase()).toContain('data analyst');
    
    console.log(`✅ Title text verified: ${titleText}`);
  });

  test('should debug data analyst selectors', async ({ page }) => {
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.debugDataAnalystSelectors();
    
    // Verificar que la página cargó correctamente
    await dataAnalystPage.verifyDataAnalystPage();
    
    console.log('✅ Data Analyst page debug completed');
  });
});
