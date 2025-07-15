import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model para la página principal de Roadmap.sh
 */
export class HomePage extends BasePage {
  readonly dataAnalystLink: Locator;
  readonly pageTitle: Locator;
  readonly mainHeader: Locator;

  constructor(page: Page) {
    super(page);
    
    // Selectores específicos de la página principal
    this.dataAnalystLink = page.locator('a[href="/data-analyst"]');
    this.pageTitle = page.locator('h1');
    this.mainHeader = page.locator('header h1');
  }

  /**
   * Navegar a la página principal de Roadmap.sh
   */
  async navigateToHome(): Promise<void> {
    await this.navigateTo('https://roadmap.sh/');
  }

  /**
   * Hacer clic en el enlace de Data Analyst
   */
  async clickDataAnalyst(): Promise<void> {
    await this.clickElement(this.dataAnalystLink);
  }

  /**
   * Hacer clic en Data Analyst con manejo robusto
   */
  async clickDataAnalystRobust(): Promise<void> {
    try {
      await this.clickElement(this.dataAnalystLink);
    } catch (error) {
      console.error('Error al hacer clic en Data Analyst:', error);
      // Intentar selector alternativo
      await this.page.click('text="Data Analyst"');
    }
  }

  /**
   * Verificar que el enlace de Data Analyst está visible
   */
  async verifyDataAnalystLinkExists(): Promise<void> {
    await this.waitForElement(this.dataAnalystLink);
    const isVisible = await this.dataAnalystLink.isVisible();
    expect(isVisible).toBe(true);
  }

  /**
   * Verificar que estamos en la página principal
   */
  async verifyHomePage(): Promise<void> {
    expect(this.page.url()).toContain('roadmap.sh');
    expect(this.page.url()).not.toContain('/data-analyst');
  }

  /**
   * Obtener el texto del título principal
   */
  async getMainTitle(): Promise<string> {
    await this.waitForElement(this.pageTitle);
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Debug de selectores de la página principal
   */
  async debugHomeSelectors(): Promise<void> {
    console.log('=== HOME PAGE DEBUG ===');
    
    const linkExists = await this.dataAnalystLink.isVisible();
    console.log(`Data Analyst link visible: ${linkExists}`);
    
    const title = await this.getMainTitle();
    console.log(`Main title: ${title}`);
    
    console.log(`Current URL: ${this.page.url()}`);
  }

  /**
   * Tomar screenshot de la página principal
   */
  async takeHomeScreenshot(): Promise<void> {
    await this.page.screenshot({ path: 'test-results/screenshots/home-page.png' });
  }
}
