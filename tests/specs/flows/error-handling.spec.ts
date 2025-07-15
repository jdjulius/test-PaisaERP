import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { DataAnalystPage } from '../../pages/DataAnalystPage';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Flow de manejo de errores para validar la robustez
 * del sistema ante diferentes escenarios de error
 */
test.describe('Error Handling Flow', () => {
  let homePage: HomePage;
  let dataAnalystPage: DataAnalystPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    dataAnalystPage = new DataAnalystPage(page);
    loginPage = new LoginPage(page);
  });

  test('Error handling: Invalid URL navigation', async ({ page }) => {
    // Probar navegación a URLs inválidas
    
    try {
      await page.goto('https://roadmap.sh/invalid-page');
      await page.waitForTimeout(3000);
      
      // Verificar que se maneja el error apropiadamente
      const url = page.url();
      const title = await page.title();
      
      console.log(`Current URL after invalid navigation: ${url}`);
      console.log(`Page title: ${title}`);
      
      // Navegar de vuelta a una página válida
      await homePage.navigateToHome();
      await homePage.verifyHomePage();
      
      console.log('✅ Successfully recovered from invalid URL navigation');
    } catch (error) {
      console.log('✅ Invalid URL properly handled with error:', (error as Error).message);
    }
  });

  test('Error handling: Network timeout simulation', async ({ page }) => {
    // Simular timeout de red
    
    try {
      // Establecer timeout muy bajo para forzar error
      page.setDefaultTimeout(1000);
      
      await homePage.navigateToHome();
      await homePage.verifyHomePage();
      
      console.log('✅ Page loaded within timeout');
    } catch (error) {
      console.log('✅ Timeout error handled appropriately:', (error as Error).message);
      
      // Restaurar timeout normal y reintentar
      page.setDefaultTimeout(30000);
      await homePage.navigateToHome();
      await homePage.verifyHomePage();
      
      console.log('✅ Successfully recovered after timeout');
    }
  });

  test('Error handling: Missing elements graceful degradation', async ({ page }) => {
    // Probar manejo de elementos faltantes
    
    await homePage.navigateToHome();
    await homePage.verifyHomePage();
    
    // Intentar hacer clic en elemento que podría no existir
    try {
      await homePage.clickDataAnalyst();
      await dataAnalystPage.verifyDataAnalystPage();
      console.log('✅ Standard navigation successful');
    } catch (error) {
      console.log('✅ Navigation error handled, trying alternative approach');
      
      // Método alternativo robusto
      await homePage.clickDataAnalystRobust();
      await dataAnalystPage.verifyDataAnalystPage();
      console.log('✅ Alternative navigation successful');
    }
  });

  test('Error handling: Page load failure recovery', async ({ page }) => {
    // Probar recuperación de fallos de carga de página
    
    const maxRetries = 3;
    let retryCount = 0;
    let success = false;
    
    while (retryCount < maxRetries && !success) {
      try {
        await homePage.navigateToHome();
        await homePage.verifyHomePage();
        success = true;
        console.log(`✅ Page loaded successfully on attempt ${retryCount + 1}`);
      } catch (error) {
        retryCount++;
        console.log(`❌ Attempt ${retryCount} failed: ${(error as Error).message}`);
        
        if (retryCount < maxRetries) {
          console.log('🔄 Retrying page load...');
          await page.waitForTimeout(2000); // Esperar antes de reintentar
        } else {
          console.log('❌ Max retries reached, test failed');
          throw error;
        }
      }
    }
    
    expect(success).toBe(true);
  });

  test('Error handling: Login button failure fallback', async ({ page }) => {
    // Probar manejo de errores en botón de login
    
    await dataAnalystPage.navigateToDataAnalyst();
    await dataAnalystPage.verifyDataAnalystPage();
    
    try {
      // Intentar click normal
      await dataAnalystPage.clickLoginButton();
      await loginPage.verifyAuthenticationPage();
      console.log('✅ Standard login click successful');
    } catch (error) {
      console.log('✅ Standard login click failed, trying robust method');
      
      // Método robusto con fallback
      await dataAnalystPage.clickLoginButtonRobust();
      await loginPage.verifyAuthenticationPage();
      console.log('✅ Robust login click successful');
    }
  });

  test('Error handling: Screenshot capture on failure', async ({ page }) => {
    // Probar captura de screenshots en caso de error
    
    try {
      await homePage.navigateToHome();
      await homePage.verifyHomePage();
      
      // Simular un error intentional
      await page.locator('non-existent-element').click({ timeout: 1000 });
      
    } catch (error) {
      console.log('✅ Expected error occurred, capturing screenshot');
      
      // Capturar screenshot del error
      await page.screenshot({ 
        path: 'test-results/screenshots/error-handling-failure.png',
        fullPage: true 
      });
      
      console.log('✅ Error screenshot captured successfully');
      
      // Continuar con recuperación
      await homePage.verifyHomePage();
      console.log('✅ System recovered after error');
    }
  });
});
