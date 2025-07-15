import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model para la página de Data Analyst
 */
export class DataAnalystPage extends BasePage {
  readonly pageTitle: Locator;
  readonly roadmapContainer: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Selectores específicos de la página Data Analyst
    this.pageTitle = page.locator('h1');
    this.roadmapContainer = page.locator('[data-testid="roadmap-container"]');
    this.loginButton = page.locator('a[href="/login"]').first();
  }

  /**
   * Navegar directamente a la página de Data Analyst
   */
  async navigateToDataAnalyst(): Promise<void> {
    await this.navigateTo('https://roadmap.sh/data-analyst');
  }

  /**
   * Validar que el título contiene "Data Analyst Roadmap"
   */
  async validateDataAnalystTitle(): Promise<void> {
    await this.waitForElement(this.pageTitle);
    const titleText = await this.pageTitle.textContent();
    expect(titleText).toContain('Data Analyst Roadmap');
  }

  /**
   * Verificar que estamos en la página correcta
   */
  async verifyDataAnalystPage(): Promise<void> {
    expect(this.page.url()).toContain('/data-analyst');
  }

  /**
   * Obtener el texto del título
   */
  async getTitleText(): Promise<string> {
    await this.waitForElement(this.pageTitle);
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Verificar que los elementos principales están presentes
   */
  async verifyPageElements(): Promise<void> {
    await this.waitForElement(this.pageTitle);
    // Nota: roadmapContainer puede no existir, se verifica solo si está presente
    try {
      await this.waitForElement(this.roadmapContainer);
    } catch (error) {
      console.log('roadmapContainer no encontrado, continuando...');
    }
  }

  /**
   * Hacer clic en el botón Login
   */
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * Verificar que el botón Login está visible
   */
  async verifyLoginButtonExists(): Promise<void> {
    await this.waitForElement(this.loginButton);
    const isVisible = await this.loginButton.isVisible();
    expect(isVisible).toBe(true);
  }

  /**
   * Hacer clic en Login con manejo robusto de errores
   */
  async clickLoginButtonRobust(): Promise<void> {
    try {
      await this.clickElement(this.loginButton);
    } catch (error) {
      console.error('Error al hacer clic en Login:', error);
      // Intentar selectores alternativos
      try {
        await this.page.click('a[href="/login"]');
      } catch (secondError) {
        console.error('Error con selector alternativo:', secondError);
        await this.page.click('text="Login"');
      }
    }
  }

  /**
   * Esperar a que la página se cargue completamente
   */
  async waitForDataAnalystPage(): Promise<void> {
    await this.page.waitForFunction(() => {
      return document.title.includes('Data Analyst') && 
             document.readyState === 'complete';
    });
  }

  /**
   * Debug de selectores de la página Data Analyst
   */
  async debugDataAnalystSelectors(): Promise<void> {
    console.log('=== DATA ANALYST PAGE DEBUG ===');
    
    const title = await this.getTitleText();
    console.log(`Page title: ${title}`);
    
    const loginButtonExists = await this.loginButton.isVisible();
    console.log(`Login button visible: ${loginButtonExists}`);
    
    console.log(`Current URL: ${this.page.url()}`);
  }

  /**
   * Tomar screenshot de la página Data Analyst
   */
  async takeDataAnalystScreenshot(): Promise<void> {
    await this.page.screenshot({ path: 'test-results/screenshots/data-analyst-page.png' });
  }
}
