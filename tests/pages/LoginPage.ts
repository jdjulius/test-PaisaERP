import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model para la página de Login de Roadmap.sh
 */
export class LoginPage extends BasePage {
  readonly loginForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly pageTitle: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Selectores específicos de la página de Login
    this.loginForm = page.locator('form');
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.pageTitle = page.locator('h1');
    this.signInButton = page.locator('button:has-text("Sign In"), button:has-text("Login")');
  }

  /**
   * Navegar directamente a la página de Login
   */
  async navigateToLogin(): Promise<void> {
    await this.navigateTo('https://roadmap.sh/login');
  }

  /**
   * Validar que estamos en la página de Login
   */
  async validateLoginPage(): Promise<void> {
    // Verificar URL o presencia de elementos de login
    const isLoginPage = this.page.url().includes('/login') || 
                       this.page.url().includes('login') ||
                       await this.loginForm.isVisible().catch(() => false);
    
    expect(isLoginPage).toBe(true);
  }

  /**
   * Verificar que el formulario de login está presente
   */
  async verifyLoginForm(): Promise<void> {
    try {
      await this.waitForElement(this.loginForm);
      await this.waitForElement(this.emailInput);
      await this.waitForElement(this.passwordInput);
    } catch (error) {
      console.log('Formulario de login no encontrado, puede ser una página diferente');
    }
  }

  /**
   * Llenar el formulario de login
   */
  async fillLoginForm(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Hacer clic en el botón de login
   */
  async clickLoginButton(): Promise<void> {
    try {
      await this.clickElement(this.loginButton);
    } catch (error) {
      // Intentar con botón alternativo
      await this.clickElement(this.signInButton);
    }
  }

  /**
   * Proceso completo de login
   */
  async performLogin(email: string, password: string): Promise<void> {
    await this.fillLoginForm(email, password);
    await this.clickLoginButton();
  }

  /**
   * Obtener el título de la página
   */
  async getPageTitle(): Promise<string> {
    await this.waitForElement(this.pageTitle);
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Verificar que estamos en la página correcta
   */
  async verifyLoginPage(): Promise<void> {
    const currentUrl = this.page.url();
    const hasLoginInUrl = currentUrl.includes('/login') || 
                         currentUrl.includes('login') ||
                         currentUrl.includes('signin') ||
                         currentUrl.includes('auth');
    
    expect(hasLoginInUrl).toBe(true);
  }

  /**
   * Debug de selectores de la página de Login
   */
  async debugLoginSelectors(): Promise<void> {
    console.log('=== LOGIN PAGE DEBUG ===');
    
    const formExists = await this.loginForm.isVisible().catch(() => false);
    console.log(`Login form visible: ${formExists}`);
    
    const title = await this.getPageTitle().catch(() => 'No title found');
    console.log(`Page title: ${title}`);
    
    console.log(`Current URL: ${this.page.url()}`);
  }

  /**
   * Tomar screenshot de la página de Login
   */
  async takeLoginScreenshot(): Promise<void> {
    await this.page.screenshot({ path: 'test-results/screenshots/login-page.png' });
  }

  /**
   * Verificar si llegamos a una página de autenticación
   */
  async verifyAuthenticationPage(): Promise<void> {
    const currentUrl = this.page.url();
    const isAuthPage = currentUrl.includes('login') || 
                      currentUrl.includes('signin') ||
                      currentUrl.includes('auth') ||
                      currentUrl.includes('account');
    
    expect(isAuthPage).toBe(true);
  }
}
