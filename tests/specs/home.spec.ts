import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

/**
 * Suite de pruebas para la página principal de Roadmap.sh
 */
test.describe('Roadmap.sh - Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('should load home page successfully', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.verifyHomePage();
    
    // Verificar que el título está presente
    const title = await homePage.getMainTitle();
    expect(title).toBeTruthy();
    
    await homePage.takeHomeScreenshot();
  });

  test('should display Data Analyst link', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.verifyDataAnalystLinkExists();
    
    console.log('✅ Data Analyst link found on home page');
  });

  test('should navigate to Data Analyst page', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.clickDataAnalyst();
    
    // Verificar que navegó correctamente
    expect(page.url()).toContain('/data-analyst');
    
    console.log('✅ Successfully navigated to Data Analyst page');
  });

  test('should handle Data Analyst click robustly', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.clickDataAnalystRobust();
    
    // Verificar navegación exitosa
    expect(page.url()).toContain('/data-analyst');
    
    console.log('✅ Robust navigation to Data Analyst page successful');
  });

  test('should debug home page selectors', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.debugHomeSelectors();
    
    // Verificar que la página cargó correctamente
    await homePage.verifyHomePage();
    
    console.log('✅ Home page debug completed');
  });
});
