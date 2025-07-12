import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Página de Login del ERP
 * Implementa acciones específicas para autenticación
 */
export class LoginPage extends BasePage {
  // Locators de elementos de la página
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly companySelect: Locator;

  constructor(page: Page) {
    super(page);
    
    // Inicializar locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-btn');
    this.errorMessage = page.locator('.error-message');
    this.forgotPasswordLink = page.locator('#forgot-password');
    this.rememberMeCheckbox = page.locator('#remember-me');
    this.companySelect = page.locator('#company-select');
  }

  /**
   * Navegar a la página de login
   */
  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  /**
   * Realizar login con credenciales
   * @param username - Nombre de usuario
   * @param password - Contraseña
   * @param company - Empresa (opcional)
   */
  async login(username: string, password: string, company?: string): Promise<void> {
    await this.fillField(this.usernameInput, username);
    await this.fillField(this.passwordInput, password);
    
    if (company) {
      await this.selectOption(this.companySelect, company);
    }
    
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Verificar si el login fue exitoso
   * Debe ser redirigido al dashboard
   */
  async verifyLoginSuccess(): Promise<void> {
    await this.page.waitForURL('**/dashboard');
    await this.verifyUrl('/dashboard');
  }

  /**
   * Verificar mensaje de error en login
   * @param expectedMessage - Mensaje de error esperado
   */
  async verifyLoginError(expectedMessage: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage);
    await this.verifyElementText(this.errorMessage, expectedMessage);
  }

  /**
   * Hacer clic en "Olvidé mi contraseña"
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  /**
   * Marcar/desmarcar "Recordarme"
   * @param remember - True para marcar, false para desmarcar
   */
  async setRememberMe(remember: boolean): Promise<void> {
    if (remember) {
      await this.rememberMeCheckbox.check();
    } else {
      await this.rememberMeCheckbox.uncheck();
    }
  }

  /**
   * Obtener opciones disponibles de empresa
   * @returns Array de opciones de empresa
   */
  async getCompanyOptions(): Promise<string[]> {
    await this.waitForElement(this.companySelect);
    const options = await this.companySelect.locator('option').all();
    const optionTexts: string[] = [];
    
    for (const option of options) {
      const text = await option.textContent();
      if (text) {
        optionTexts.push(text);
      }
    }
    
    return optionTexts;
  }

  /**
   * Verificar que la página de login esté cargada
   */
  async verifyLoginPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.usernameInput);
    await this.verifyElementVisible(this.passwordInput);
    await this.verifyElementVisible(this.loginButton);
  }

  /**
   * Limpiar campos de login
   */
  async clearLoginFields(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}
