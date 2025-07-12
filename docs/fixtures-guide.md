# Fixtures Personalizados ERP - Guía de Uso

## Introducción

Los fixtures personalizados en nuestro proyecto ERP simplifican la configuración y reutilización de recursos comunes en los tests. Proporcionan una forma elegante de inicializar páginas, cargar datos y configurar estados necesarios para las pruebas.

## Fixtures Disponibles

### 1. Fixtures Básicos

#### `loginPage`
- **Tipo**: `LoginPage`
- **Descripción**: Instancia inicializada de la página de login
- **Uso**: Para tests que requieren interacción con el login

```typescript
test('Should login successfully', async ({ loginPage }) => {
  await loginPage.navigateToLogin();
  await loginPage.verifyLoginPageLoaded();
});
```

#### `testUsers`
- **Tipo**: `UserData[]`
- **Descripción**: Array de usuarios de prueba cargados desde JSON
- **Uso**: Para acceder a datos de usuarios sin cargar manualmente

```typescript
test('Should validate user data', async ({ testUsers }) => {
  expect(testUsers).toHaveLength(4);
  const admin = testUsers.find(user => user.role === 'administrator');
  expect(admin).toBeDefined();
});
```

#### `adminUser`
- **Tipo**: `UserData`
- **Descripción**: Usuario administrador activo, pre-filtrado y validado
- **Uso**: Para tests que requieren permisos de administrador

```typescript
test('Should access admin features', async ({ adminUser, loginPage }) => {
  await loginPage.navigateToLogin();
  await loginPage.login(adminUser.username, adminUser.password);
  // Continuar con funcionalidades de admin
});
```

#### `regularUser`
- **Tipo**: `UserData`
- **Descripción**: Usuario regular activo, pre-filtrado y validado
- **Uso**: Para tests que necesitan usuario con permisos limitados

```typescript
test('Should access user features', async ({ regularUser, loginPage }) => {
  await loginPage.navigateToLogin();
  await loginPage.login(regularUser.username, regularUser.password);
  // Continuar con funcionalidades de usuario
});
```

#### `authenticatedPage`
- **Tipo**: `Page`
- **Descripción**: Página ya autenticada con usuario administrador
- **Uso**: Para tests que requieren estar ya logueados

```typescript
test('Should access dashboard', async ({ authenticatedPage }) => {
  // Ya está autenticado, no necesitas hacer login
  await expect(authenticatedPage).toHaveURL(/dashboard/);
  
  const welcomeMessage = authenticatedPage.locator('.welcome-message');
  await expect(welcomeMessage).toBeVisible();
});
```

### 2. Fixtures de Módulo

#### `moduleData`
- **Tipo**: `any[]`
- **Descripción**: Datos específicos del módulo basados en el nombre del test
- **Uso**: Para cargar datos específicos por módulo automáticamente

```typescript
moduleTest('Products should create product', async ({ moduleData }) => {
  // Carga automáticamente 'products-testdata.json'
  if (moduleData.length > 0) {
    const productData = moduleData[0];
    await productPage.createProduct(productData);
  }
});
```

#### `environment`
- **Tipo**: `string`
- **Descripción**: Ambiente actual (dev, test, staging, prod)
- **Uso**: Para configurar tests según el ambiente

```typescript
moduleTest('Should use correct environment', async ({ environment }) => {
  expect(environment).toBe('test');
  
  if (environment === 'prod') {
    // Configuración específica para producción
  }
});
```

## Implementación de Fixtures

### Estructura Base

```typescript
// tests/fixtures/erp-fixtures.ts
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { UserData } from '../types';

export interface ERPFixtures {
  loginPage: LoginPage;
  testUsers: UserData[];
  authenticatedPage: Page;
  adminUser: UserData;
  regularUser: UserData;
}

export const test = base.extend<ERPFixtures>({
  // Implementación de fixtures...
});
```

### Fixture con Validación

```typescript
adminUser: async ({ testUsers }, use) => {
  const adminUser = testUsers.find((user: UserData) => 
    user.role === 'administrator' && user.active === true
  );
  
  if (!adminUser) {
    throw new Error('No se encontró usuario administrador activo');
  }
  
  await use(adminUser);
},
```

### Fixture con Setup y Teardown

```typescript
authenticatedPage: async ({ page, adminUser }, use) => {
  // Setup: realizar login
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLogin();
  await loginPage.login(adminUser.username, adminUser.password);
  await loginPage.verifyLoginSuccess();
  
  // Usar la página autenticada
  await use(page);
  
  // Teardown: limpiar estado si es necesario
  // await page.context().clearCookies();
},
```

## Uso Avanzado

### Combinando Múltiples Fixtures

```typescript
test('Should test user management', async ({ 
  loginPage, 
  testUsers, 
  adminUser, 
  regularUser 
}) => {
  // Usar múltiples fixtures en un solo test
  
  // Verificar datos
  expect(testUsers.length).toBeGreaterThan(1);
  expect(adminUser.role).toBe('administrator');
  expect(regularUser.role).toBe('user');
  
  // Probar con diferentes usuarios
  await loginPage.navigateToLogin();
  await loginPage.login(adminUser.username, adminUser.password);
  // ... test admin functionality
  
  await loginPage.navigateToLogin();
  await loginPage.login(regularUser.username, regularUser.password);
  // ... test user functionality
});
```

### Fixtures Personalizados

```typescript
interface CustomFixtures {
  specialUser: UserData;
  configuredPage: Page;
}

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
```

### Fixtures con Dependencias

```typescript
const complexTest = test.extend({
  databaseConnection: async ({}, use) => {
    const connection = await connectToDatabase();
    await use(connection);
    await connection.close();
  },
  
  testDataInDB: async ({ databaseConnection }, use) => {
    const testData = await databaseConnection.createTestData();
    await use(testData);
    await databaseConnection.cleanupTestData(testData.id);
  }
});
```

## Mejores Prácticas

### 1. Manejo de Errores

```typescript
adminUser: async ({ testUsers }, use) => {
  const adminUser = testUsers.find((user: UserData) => 
    user.role === 'administrator' && user.active === true
  );
  
  if (!adminUser) {
    throw new Error('No se encontró usuario administrador activo');
  }
  
  await use(adminUser);
},
```

### 2. Fixtures Condicionales

```typescript
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
```

### 3. Fixtures con Configuración

```typescript
const environmentTest = test.extend({
  config: async ({ environment }, use) => {
    const config = {
      baseUrl: environment === 'prod' ? 'https://prod.example.com' : 'http://localhost:3000',
      timeout: environment === 'prod' ? 30000 : 10000,
      retries: environment === 'prod' ? 2 : 0
    };
    
    await use(config);
  }
});
```

### 4. Fixtures con Cache

```typescript
const cachedTest = test.extend({
  expensiveData: [async ({}, use) => {
    // Este fixture se ejecuta solo una vez por worker
    const data = await loadExpensiveData();
    await use(data);
  }, { scope: 'worker' }]
});
```

## Debugging de Fixtures

### Logs en Fixtures

```typescript
testUsers: async ({}, use) => {
  console.log('Loading test users...');
  const users: UserData[] = await DataProvider.getUserData('test');
  console.log(`Loaded ${users.length} test users`);
  
  await use(users);
  
  console.log('Test users fixture completed');
},
```

### Verificación de Estado

```typescript
authenticatedPage: async ({ page, adminUser }, use) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLogin();
  await loginPage.login(adminUser.username, adminUser.password);
  
  // Verificar que el login fue exitoso
  await expect(page).toHaveURL(/dashboard/);
  console.log('Authentication successful');
  
  await use(page);
},
```

## Integración con CI/CD

### Fixtures por Ambiente

```typescript
export const test = base.extend<ERPFixtures>({
  testUsers: async ({}, use) => {
    const environment = process.env.NODE_ENV || 'test';
    const users: UserData[] = await DataProvider.getUserData(environment);
    await use(users);
  },
  
  authenticatedPage: async ({ page, adminUser }, use) => {
    const loginPage = new LoginPage(page);
    
    // Configurar según ambiente
    if (process.env.CI) {
      await page.setDefaultTimeout(30000);
    }
    
    await loginPage.navigateToLogin();
    await loginPage.login(adminUser.username, adminUser.password);
    await loginPage.verifyLoginSuccess();
    
    await use(page);
  }
});
```

## Troubleshooting

### Problemas Comunes

1. **Fixture no encontrado**
   ```
   Error: Property 'myFixture' does not exist
   ```
   - Verificar que el fixture esté definido en la interfaz
   - Importar el test correcto que incluye el fixture

2. **Datos no disponibles**
   ```
   Error: No se encontró usuario administrador activo
   ```
   - Verificar que los datos de prueba existan
   - Validar estructura de datos

3. **Timeouts en fixtures**
   ```
   Error: Timeout exceeded in fixture
   ```
   - Aumentar timeout del fixture
   - Verificar conectividad de red

### Debugging

```typescript
// Agregar logs detallados
adminUser: async ({ testUsers }, use) => {
  console.log('Available users:', testUsers.map(u => ({ 
    username: u.username, 
    role: u.role, 
    active: u.active 
  })));
  
  const adminUser = testUsers.find((user: UserData) => 
    user.role === 'administrator' && user.active === true
  );
  
  if (!adminUser) {
    console.error('No admin user found in:', testUsers);
    throw new Error('No se encontró usuario administrador activo');
  }
  
  console.log('Using admin user:', adminUser.username);
  await use(adminUser);
},
```

## Conclusión

Los fixtures personalizados proporcionan una base sólida para tests mantenibles y reutilizables. Al encapsular la lógica de configuración en fixtures, los tests se vuelven más legibles y menos propensos a errores.

### Beneficios

- ✅ **Reutilización**: Código de configuración compartido
- ✅ **Mantenibilidad**: Cambios centralizados
- ✅ **Legibilidad**: Tests más claros y enfocados
- ✅ **Confiabilidad**: Validación y manejo de errores consistente
- ✅ **Escalabilidad**: Fácil agregar nuevos fixtures

### Siguiente Paso

Crear fixtures específicos para cada módulo del ERP según las necesidades del proyecto.
