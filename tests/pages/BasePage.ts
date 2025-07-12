import { Page, Locator, expect } from '@playwright/test';

/**
 * Clase base para todas las páginas del ERP
 * Implementa el patrón Page Object Model (POM)
 */
export class BasePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navegar a una URL específica
   * @param url - URL a navegar
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Esperar a que un elemento sea visible
   * @param locator - Locator del elemento
   * @param timeout - Tiempo de espera en ms
   */
  async waitForElement(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Hacer clic en un elemento
   * @param locator - Locator del elemento
   */
  async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Escribir texto en un campo
   * @param locator - Locator del campo
   * @param text - Texto a escribir
   */
  async fillField(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Seleccionar opción de un dropdown
   * @param locator - Locator del dropdown
   * @param option - Opción a seleccionar
   */
  async selectOption(locator: Locator, option: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.selectOption(option);
  }

  /**
   * Obtener texto de un elemento
   * @param locator - Locator del elemento
   * @returns Texto del elemento
   */
  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  /**
   * Verificar que un elemento esté visible
   * @param locator - Locator del elemento
   */
  async verifyElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Verificar que un elemento contenga texto específico
   * @param locator - Locator del elemento
   * @param text - Texto esperado
   */
  async verifyElementText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  /**
   * Esperar a que la página cargue completamente
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Tomar screenshot de la página
   * @param name - Nombre del screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Scroll hasta un elemento
   * @param locator - Locator del elemento
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Esperar por tiempo específico
   * @param ms - Milisegundos a esperar
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Refrescar la página
   */
  async refreshPage(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Obtener el título de la página
   * @returns Título de la página
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Verificar URL actual
   * @param expectedUrl - URL esperada
   */
  async verifyUrl(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }
}
