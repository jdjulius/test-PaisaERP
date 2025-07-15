import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { DataAnalystPage } from '../../pages/DataAnalystPage';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Flow de navegación rápida sin autenticación
 * Valida la navegación básica entre páginas principales
 */
test.describe('Quick Navigation Flow', () => {
  let homePage: HomePage;
  let dataAnalystPage: DataAnalystPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    dataAnalystPage = new DataAnalystPage(page);
    loginPage = new LoginPage(page);
  });

  test('Quick navigation: Home → Data Analyst → Back to Home', async ({ page }) => {
    // Paso 1: Navegar a Home
    await homePage.navigateToHome();
    await homePage.verifyHomePage();
    
    const homeUrl = page.url();
    console.log('✅ Step 1: Home page loaded');

    // Paso 2: Navegar a Data Analyst
    await homePage.clickDataAnalyst();
    await dataAnalystPage.verifyDataAnalystPage();
    
    console.log('✅ Step 2: Data Analyst page loaded');

    // Paso 3: Regresar a Home usando navegación del navegador
    await page.goBack();
    await homePage.verifyHomePage();
    
    console.log('✅ Step 3: Successfully navigated back to Home');
    
    // Verificación final
    expect(page.url()).toBe(homeUrl);
  });

  test('Direct navigation to each page', async ({ page }) => {
    // Test navegación directa a cada página
    
    // Home page
    await homePage.navigateToHome();
    await homePage.verifyHomePage();
    console.log('✅ Direct navigation to Home: Success');

    // Data Analyst page
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.verifyDataAnalystPage();
    console.log('✅ Direct navigation to Data Analyst: Success');

    // Login page
    await loginPage.navigateToLogin();
    await loginPage.verifyAuthenticationPage();
    console.log('✅ Direct navigation to Login: Success');
  });

  test('Page title validation flow', async ({ page }) => {
    // Validar títulos de todas las páginas
    
    // Home page title
    await homePage.navigateToHome();
    const homeTitle = await homePage.getMainTitle();
    expect(homeTitle).toBeTruthy();
    console.log(`✅ Home page title: "${homeTitle}"`);

    // Data Analyst page title
    await dataAnalystPage.navigateToDataAnalyst();
    const dataAnalystTitle = await dataAnalystPage.getTitleText();
    expect(dataAnalystTitle).toContain('Data Analyst');
    console.log(`✅ Data Analyst page title: "${dataAnalystTitle}"`);

    // Login page title
    await loginPage.navigateToLogin();
    const loginTitle = await loginPage.getPageTitle();
    expect(loginTitle).toBeTruthy();
    console.log(`✅ Login page title: "${loginTitle}"`);
  });
});
