import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { DataAnalystPage } from '../../pages/DataAnalystPage';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Flow de validación visual para verificar que los elementos
 * principales estén presentes y correctamente posicionados
 */
test.describe('Visual Validation Flow', () => {
  let homePage: HomePage;
  let dataAnalystPage: DataAnalystPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    dataAnalystPage = new DataAnalystPage(page);
    loginPage = new LoginPage(page);
  });

  test('Visual validation: All pages screenshot capture', async ({ page }) => {
    // Capturar screenshots de todas las páginas para validación visual
    
    // Home page screenshot
    await homePage.navigateToHome();
    await homePage.verifyHomePage();
    await page.screenshot({ 
      path: 'test-results/screenshots/visual-home-page.png',
      fullPage: true 
    });
    console.log('✅ Home page screenshot captured');

    // Data Analyst page screenshot
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.verifyDataAnalystPage();
    await page.screenshot({ 
      path: 'test-results/screenshots/visual-data-analyst-page.png',
      fullPage: true 
    });
    console.log('✅ Data Analyst page screenshot captured');

    // Login page screenshot
    await loginPage.navigateToLogin();
    await loginPage.verifyAuthenticationPage();
    await page.screenshot({ 
      path: 'test-results/screenshots/visual-login-page.png',
      fullPage: true 
    });
    console.log('✅ Login page screenshot captured');
  });

  test('Visual validation: Element visibility check', async ({ page }) => {
    // Verificar que elementos clave estén visibles en cada página
    
    // Home page elements
    await homePage.navigateToHome();
    await homePage.verifyDataAnalystLinkExists();
    const homeTitle = await homePage.getMainTitle();
    expect(homeTitle).toBeTruthy();
    console.log('✅ Home page elements validated');

    // Data Analyst page elements
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.verifyLoginButtonExists();
    const dataAnalystTitle = await dataAnalystPage.getTitleText();
    expect(dataAnalystTitle).toContain('Data Analyst');
    console.log('✅ Data Analyst page elements validated');

    // Login page elements
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginForm();
    const loginTitle = await loginPage.getPageTitle();
    expect(loginTitle).toBeTruthy();
    console.log('✅ Login page elements validated');
  });

  test('Visual validation: Responsive layout check', async ({ page }) => {
    // Verificar que las páginas se vean correctamente en diferentes tamaños
    
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1366, height: 768, name: 'laptop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      console.log(`Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

      // Test Home page
      await homePage.navigateToHome();
      await homePage.verifyHomePage();
      await page.screenshot({ 
        path: `test-results/screenshots/responsive-home-${viewport.name}.png`,
        fullPage: true 
      });

      // Test Data Analyst page
      await dataAnalystPage.navigateToDataAnalyst();
      await dataAnalystPage.verifyDataAnalystPage();
      await page.screenshot({ 
        path: `test-results/screenshots/responsive-data-analyst-${viewport.name}.png`,
        fullPage: true 
      });

      console.log(`✅ ${viewport.name} viewport validation completed`);
    }
  });

  test('Visual validation: Page loading performance', async ({ page }) => {
    // Medir tiempos de carga y validar performance visual
    
    const startTime = Date.now();
    
    // Medir Home page
    const homeStartTime = Date.now();
    await homePage.navigateToHome();
    await homePage.verifyHomePage();
    const homeLoadTime = Date.now() - homeStartTime;
    
    // Medir Data Analyst page
    const dataAnalystStartTime = Date.now();
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.verifyDataAnalystPage();
    const dataAnalystLoadTime = Date.now() - dataAnalystStartTime;
    
    // Medir Login page
    const loginStartTime = Date.now();
    await loginPage.navigateToLogin();
    await loginPage.verifyAuthenticationPage();
    const loginLoadTime = Date.now() - loginStartTime;
    
    const totalTime = Date.now() - startTime;
    
    // Validar que los tiempos estén dentro de límites aceptables
    expect(homeLoadTime).toBeLessThan(15000); // 15 segundos
    expect(dataAnalystLoadTime).toBeLessThan(15000); // 15 segundos
    expect(loginLoadTime).toBeLessThan(15000); // 15 segundos
    
    console.log(`✅ Performance metrics:
      - Home page load: ${homeLoadTime}ms
      - Data Analyst page load: ${dataAnalystLoadTime}ms
      - Login page load: ${loginLoadTime}ms
      - Total validation time: ${totalTime}ms`);
  });
});
