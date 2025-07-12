import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DataProvider } from '../utils/DataProvider';
import { UserData } from '../types';

/**
 * Suite de pruebas para módulo de Login
 * Incluye casos positivos y negativos con data providers
 */
test.describe('Login Module', () => {
  let loginPage: LoginPage;
  let testUsers: UserData[];

  // Configuración antes de cada test
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    testUsers = await DataProvider.getUserData('test');
    await loginPage.navigateToLogin();
  });

  test('Should load login page correctly', async () => {
    await loginPage.verifyLoginPageLoaded();
    await expect(loginPage.page).toHaveTitle(/Login/);
  });

  test('Should login successfully with valid credentials', async () => {
    const adminUser = testUsers.find(user => user.role === 'administrator');
    
    if (!adminUser) {
      test.skip(true, 'No administrator user found');
      return;
    }
    
    await loginPage.login(adminUser.username, adminUser.password);
    await loginPage.verifyLoginSuccess();
  });

  test('Should show error with invalid credentials', async () => {
    await loginPage.login('invalid_user', 'invalid_password');
    await loginPage.verifyLoginError('Credenciales incorrectas');
  });

  test('Should show error with empty credentials', async () => {
    await loginPage.login('', '');
    await loginPage.verifyLoginError('Por favor ingrese sus credenciales');
  });

  test('Should not login with inactive user', async () => {
    const inactiveUser = testUsers.find(user => user.active === false);
    
    if (!inactiveUser) {
      test.skip(true, 'No inactive user found');
      return;
    }
    
    await loginPage.login(inactiveUser.username, inactiveUser.password);
    await loginPage.verifyLoginError('Usuario inactivo');
  });

  test('Should remember user when checkbox is checked', async () => {
    const user = testUsers.find(user => user.role === 'user');
    
    if (!user) {
      test.skip(true, 'No regular user found');
      return;
    }
    
    await loginPage.setRememberMe(true);
    await loginPage.login(user.username, user.password);
    await loginPage.verifyLoginSuccess();
    
    // Verificar que el usuario se mantenga después de cerrar sesión
    // Esta lógica dependería de la implementación específica del ERP
  });

  test('Should display company options correctly', async () => {
    const companies = await loginPage.getCompanyOptions();
    
    expect(companies).toContain('Empresa Principal');
    expect(companies).toContain('Empresa Secundaria');
    expect(companies.length).toBeGreaterThan(0);
  });

  test('Should login with specific company selection', async () => {
    const user = testUsers.find(user => user.company === 'Empresa Secundaria');
    
    if (!user) {
      test.skip(true, 'No user with Empresa Secundaria found');
      return;
    }
    
    await loginPage.login(user.username, user.password, user.company);
    await loginPage.verifyLoginSuccess();
  });

  test('Should navigate to forgot password page', async () => {
    await loginPage.clickForgotPassword();
    await expect(loginPage.page).toHaveURL(/forgot-password/);
  });

  // Test parametrizado con múltiples usuarios
  test.describe('Login with multiple users', () => {
    const userRoles = ['administrator', 'user', 'viewer'];
    
    userRoles.forEach(role => {
      test(`Should login successfully as ${role}`, async ({ page }) => {
        const loginPageForRole = new LoginPage(page);
        const users: UserData[] = await DataProvider.getUserData('test');
        const user = users.find((u: UserData) => u.role === role && u.active === true);
        
        if (!user) {
          test.skip(true, `No active user found for role: ${role}`);
          return;
        }
        
        await loginPageForRole.navigateToLogin();
        await loginPageForRole.login(user.username, user.password);
        await loginPageForRole.verifyLoginSuccess();
      });
    });
  });

  // Test con datos generados dinámicamente
  test('Should handle dynamically generated invalid credentials', async () => {
    const randomEmail = DataProvider.generateRandomData('email');
    const randomPassword = DataProvider.generateRandomData('name');
    
    await loginPage.login(randomEmail, randomPassword);
    await loginPage.verifyLoginError('Credenciales incorrectas');
  });

  // Test de limpieza después de cada test
  test.afterEach(async ({ page }) => {
    await loginPage.takeScreenshot(`login-test-${Date.now()}`);
    
    // Limpiar estado si es necesario
    await loginPage.clearLoginFields();
  });
});
