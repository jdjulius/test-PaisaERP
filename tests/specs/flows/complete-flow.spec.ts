import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { DataAnalystPage } from '../../pages/DataAnalystPage';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Suite de pruebas E2E para el flujo completo de navegación
 * Demuestra la composición correcta de Page Objects sin anti-patrones
 */
test.describe('Roadmap.sh - Complete E2E Flow', () => {
  let homePage: HomePage;
  let dataAnalystPage: DataAnalystPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    dataAnalystPage = new DataAnalystPage(page);
    loginPage = new LoginPage(page);
  });

  test('Complete flow: Home → Data Analyst → Login', async ({ page }) => {
    // Paso 1: Navegar a la página principal
    await homePage.navigateToHome();
    await homePage.verifyHomePage();
    
    console.log('✅ Step 1: Home page loaded successfully');
    
    // Paso 2: Navegar a Data Analyst
    await homePage.clickDataAnalyst();
    await dataAnalystPage.verifyDataAnalystPage();
    await dataAnalystPage.validateDataAnalystTitle();
    
    console.log('✅ Step 2: Data Analyst page loaded successfully');
    
    // Paso 3: Hacer clic en Login
    await dataAnalystPage.clickLoginButton();
    await loginPage.verifyAuthenticationPage();
    
    console.log('✅ Step 3: Login page loaded successfully');
    
    // Verificación final del flujo completo
    const currentUrl = page.url();
    const isAuthPage = currentUrl.includes('login') || 
                      currentUrl.includes('signin') ||
                      currentUrl.includes('auth') ||
                      currentUrl.includes('account');
    
    expect(isAuthPage).toBeTruthy();
    
    // Tomar screenshot del resultado final
    await page.screenshot({ 
      path: 'test-results/screenshots/complete-flow-final.png',
      fullPage: true
    });
    
    console.log('✅ Complete E2E flow executed successfully');
  });

  test('Robust navigation with error handling', async ({ page }) => {
    try {
      // Paso 1: Home page con manejo robusto
      await homePage.navigateToHome();
      await homePage.verifyHomePage();
      
      // Paso 2: Data Analyst con manejo robusto
      await homePage.clickDataAnalystRobust();
      await dataAnalystPage.verifyDataAnalystPage();
      
      // Paso 3: Login con manejo robusto
      await dataAnalystPage.clickLoginButtonRobust();
      await loginPage.verifyAuthenticationPage();
      
      console.log('✅ Robust navigation flow completed successfully');
      
    } catch (error) {
      console.error('❌ Error in robust navigation:', error);
      
      // Tomar screenshot del error
      await page.screenshot({ 
        path: 'test-results/screenshots/robust-navigation-error.png',
        fullPage: true
      });
      
      throw error;
    }
  });

  test('Verify each page independently', async ({ page }) => {
    // Test cada página de forma independiente para verificar
    // que cada Page Object funciona correctamente por sí solo
    
    console.log('Testing Home Page independently...');
    await homePage.navigateToHome();
    await homePage.verifyHomePage();
    await homePage.verifyDataAnalystLinkExists();
    
    console.log('Testing Data Analyst Page independently...');
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.verifyDataAnalystPage();
    await dataAnalystPage.validateDataAnalystTitle();
    await dataAnalystPage.verifyLoginButtonExists();
    
    console.log('Testing Login Page independently...');
    await loginPage.navigateToLogin();
    await loginPage.validateLoginPage();
    await loginPage.verifyLoginForm();
    
    console.log('✅ All pages verified independently');
  });

  test('Performance validation across pages', async ({ page }) => {
    const startTime = Date.now();
    
    // Medir tiempo de carga de cada página
    const homeStartTime = Date.now();
    await homePage.navigateToHome();
    await homePage.verifyHomePage();
    const homeLoadTime = Date.now() - homeStartTime;
    
    const dataAnalystStartTime = Date.now();
    await homePage.clickDataAnalyst();
    await dataAnalystPage.verifyDataAnalystPage();
    const dataAnalystLoadTime = Date.now() - dataAnalystStartTime;
    
    const loginStartTime = Date.now();
    await dataAnalystPage.clickLoginButton();
    await loginPage.verifyAuthenticationPage();
    const loginLoadTime = Date.now() - loginStartTime;
    
    const totalTime = Date.now() - startTime;
    
    // Verificar que los tiempos de carga están dentro de límites aceptables
    expect(homeLoadTime).toBeLessThan(10000); // 10 segundos
    expect(dataAnalystLoadTime).toBeLessThan(10000); // 10 segundos
    expect(loginLoadTime).toBeLessThan(10000); // 10 segundos
    expect(totalTime).toBeLessThan(30000); // 30 segundos total
    
    console.log(`✅ Performance metrics:
      - Home page load: ${homeLoadTime}ms
      - Data Analyst page load: ${dataAnalystLoadTime}ms
      - Login page load: ${loginLoadTime}ms
      - Total flow time: ${totalTime}ms`);
  });
});
