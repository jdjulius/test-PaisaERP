import { test, expect } from '../fixtures/erp-fixtures';
import { UserData } from '../types';
import { Page } from '@playwright/test';

/**
 * Ejemplo de uso de fixtures personalizados
 * Demostración de cómo usar los fixtures del ERP
 */
test.describe('Fixtures Usage Examples', () => {
  
  test('Should use loginPage fixture', async ({ loginPage }) => {
    // El fixture loginPage ya está inicializado
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginPageLoaded();
  });

  test('Should use testUsers fixture', async ({ testUsers }) => {
    // El fixture testUsers contiene los datos de usuarios
    expect(testUsers).toHaveLength(4);
    
    const adminUser = testUsers.find(user => user.role === 'administrator');
    expect(adminUser).toBeDefined();
    expect(adminUser?.active).toBe(true);
  });

  test('Should use adminUser fixture', async ({ adminUser, loginPage }) => {
    // El fixture adminUser ya está filtrado y validado
    expect(adminUser.role).toBe('administrator');
    expect(adminUser.active).toBe(true);
    
    await loginPage.navigateToLogin();
    await loginPage.login(adminUser.username, adminUser.password);
    await loginPage.verifyLoginSuccess();
  });

  test('Should use regularUser fixture', async ({ regularUser, loginPage }) => {
    // El fixture regularUser contiene un usuario regular activo
    expect(regularUser.role).toBe('user');
    expect(regularUser.active).toBe(true);
    
    await loginPage.navigateToLogin();
    await loginPage.login(regularUser.username, regularUser.password);
    await loginPage.verifyLoginSuccess();
  });

  test('Should use authenticatedPage fixture', async ({ authenticatedPage }) => {
    // El fixture authenticatedPage ya está autenticado
    // No necesitas hacer login manualmente
    
    // Verificar que estamos en el dashboard después del login automático
    await expect(authenticatedPage).toHaveURL(/dashboard/);
    
    // Continuar con el test que requiere autenticación
    const welcomeMessage = authenticatedPage.locator('.welcome-message');
    await expect(welcomeMessage).toBeVisible();
  });

  test('Should combine multiple fixtures', async ({ 
    loginPage, 
    testUsers, 
    adminUser, 
    regularUser 
  }) => {
    // Usar múltiples fixtures en un solo test
    
    // Verificar que tenemos diferentes tipos de usuarios
    expect(testUsers.length).toBeGreaterThan(1);
    expect(adminUser.role).toBe('administrator');
    expect(regularUser.role).toBe('user');
    
    // Probar login con diferentes usuarios
    await loginPage.navigateToLogin();
    
    // Login con admin
    await loginPage.login(adminUser.username, adminUser.password);
    await loginPage.verifyLoginSuccess();
    
    // Logout y login con usuario regular
    await loginPage.navigateToLogin();
    await loginPage.login(regularUser.username, regularUser.password);
    await loginPage.verifyLoginSuccess();
  });
});

/**
 * Ejemplo de fixtures de módulo
 */
import { moduleTest } from '../fixtures/erp-fixtures';

moduleTest.describe('Module Fixtures Examples', () => {
  
  moduleTest('Should use moduleData fixture', async ({ moduleData }) => {
    // El fixture moduleData contiene datos específicos del módulo
    // basado en el nombre del test
    
    if (moduleData.length > 0) {
      expect(moduleData).toBeInstanceOf(Array);
      console.log('Module data loaded:', moduleData.length, 'items');
    } else {
      console.log('No module data available');
    }
  });

  moduleTest('Should use environment fixture', async ({ environment }) => {
    // El fixture environment contiene el ambiente actual
    expect(environment).toBe('test');
    console.log('Current environment:', environment);
  });

  moduleTest('Products should load product data', async ({ moduleData }) => {
    // Este test cargará datos de 'products-testdata.json'
    // porque el nombre del test empieza con 'Products'
    
    if (moduleData.length > 0) {
      expect(moduleData[0]).toHaveProperty('name');
      expect(moduleData[0]).toHaveProperty('price');
    }
  });
});

/**
 * Ejemplo de fixtures personalizados adicionales
 */
interface CustomFixtures {
  specialUser: UserData;
  configuredPage: Page;
}

test.describe('Custom Fixtures Example', () => {
  
  // Puedes crear fixtures personalizados específicos para tu suite
  const customTest = test.extend<CustomFixtures>({
    specialUser: async ({ testUsers }, use) => {
      const specialUser = testUsers.find((user: UserData) => 
        user.role === 'viewer' && user.active === true
      );
      
      if (!specialUser) {
        throw new Error('No special user found');
      }
      
      await use(specialUser);
    },
    
    configuredPage: async ({ page }, use) => {
      // Configurar página con configuraciones específicas
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'es-ES,es;q=0.9'
      });
      
      await use(page);
    }
  });

  customTest('Should use custom fixtures', async ({ specialUser, configuredPage }) => {
    expect(specialUser.role).toBe('viewer');
    expect(configuredPage.viewportSize()).toEqual({ width: 1920, height: 1080 });
  });
});

/**
 * Ejemplo de fixtures con setup y teardown
 */
interface SetupFixtures {
  testData: {
    id: number;
    name: string;
    created: string;
  };
}

const setupTest = test.extend<SetupFixtures>({
  testData: async ({}, use) => {
    // Setup: crear datos de prueba
    console.log('Setting up test data...');
    const testData = {
      id: Date.now(),
      name: 'Test Data',
      created: new Date().toISOString()
    };
    
    await use(testData);
    
    // Teardown: limpiar datos de prueba
    console.log('Cleaning up test data...');
    // Aquí podrías limpiar datos creados durante el test
  }
});

setupTest.describe('Setup/Teardown Example', () => {
  setupTest('Should use testData with setup and teardown', async ({ testData }) => {
    expect(testData.name).toBe('Test Data');
    expect(testData.id).toBeDefined();
    
    // El test usa los datos creados en setup
    // Al terminar, se ejecutará el teardown automáticamente
  });
});
