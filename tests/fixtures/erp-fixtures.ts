import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DataProvider } from '../utils/DataProvider';
import { UserData } from '../types';

/**
 * Fixtures personalizados para el proyecto ERP
 * Extiende las funcionalidades base de Playwright
 */
export interface ERPFixtures {
  loginPage: LoginPage;
  testUsers: UserData[];
  authenticatedPage: Page;
  adminUser: UserData;
  regularUser: UserData;
}

/**
 * Configuración de fixtures para tests del ERP
 */
export const test = base.extend<ERPFixtures>({
  /**
   * Fixture para página de login
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Fixture para usuarios de prueba
   */
  testUsers: async ({}, use) => {
    const users: UserData[] = await DataProvider.getUserData('test');
    await use(users);
  },

  /**
   * Fixture para usuario administrador
   */
  adminUser: async ({ testUsers }, use) => {
    const adminUser = testUsers.find((user: UserData) => user.role === 'administrator' && user.active === true);
    if (!adminUser) {
      throw new Error('No se encontró usuario administrador activo');
    }
    await use(adminUser);
  },

  /**
   * Fixture para usuario regular
   */
  regularUser: async ({ testUsers }, use) => {
    const regularUser = testUsers.find((user: UserData) => user.role === 'user' && user.active === true);
    if (!regularUser) {
      throw new Error('No se encontró usuario regular activo');
    }
    await use(regularUser);
  },

  /**
   * Fixture para página autenticada
   * Realiza login automático antes de cada test
   */
  authenticatedPage: async ({ page, adminUser }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.login(adminUser.username, adminUser.password);
    await loginPage.verifyLoginSuccess();
    
    await use(page);
  }
});

/**
 * Fixtures adicionales para tests específicos de módulos
 */
export interface ModuleFixtures {
  moduleData: any[];
  environment: string;
}

/**
 * Configuración de fixtures para tests específicos de módulos
 */
export const moduleTest = test.extend<ModuleFixtures>({
  /**
   * Fixture para datos de módulo específico
   */
  moduleData: async ({}, use, testInfo) => {
    const moduleName = testInfo.title?.split(' ')[0]?.toLowerCase() || 'default';
    try {
      const moduleData = await DataProvider.getModuleTestData(moduleName);
      await use(moduleData);
    } catch (error) {
      console.warn(`No module data found for ${moduleName}, using empty array`);
      await use([]);
    }
  },

  /**
   * Fixture para configuración de ambiente
   */
  environment: async ({}, use) => {
    const env = process.env.NODE_ENV || 'test';
    await use(env);
  }
});

export { expect } from '@playwright/test';
