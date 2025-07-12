# Manejo de Errores en Tests

## Errores Comunes Corregidos

### 1. Uso Incorrecto de test.skip()

**❌ Incorrecto:**
```typescript
test.skip("No user found"); // Error: string no es boolean
```

**✅ Correcto:**
```typescript
test.skip(true, "No user found"); // Primer parámetro debe ser boolean
```

### 2. Referencias No Definidas

**❌ Incorrecto:**
```typescript
test('Should login with admin', async () => {
  const admin = testUsers.find(user => user.role === 'admin');
  await loginPage.login(admin.username, admin.password); // Error si admin es undefined
});
```

**✅ Correcto:**
```typescript
test('Should login with admin', async () => {
  const admin = testUsers.find(user => user.role === 'admin');
  
  if (!admin) {
    test.skip(true, 'No admin user found');
    return;
  }
  
  await loginPage.login(admin.username, admin.password);
});
```

### 3. Tipos Implícitos (any)

**❌ Incorrecto:**
```typescript
const user = users.find(u => u.role === 'admin'); // u tiene tipo any implícito
```

**✅ Correcto:**
```typescript
// Opción 1: Tipo explícito
const user = users.find((u: UserData) => u.role === 'admin');

// Opción 2: Tipo de array
const users: UserData[] = await DataProvider.getUserData('test');
const user = users.find(u => u.role === 'admin'); // u es UserData automáticamente
```

### 4. Contexto en Tests Parametrizados

**❌ Incorrecto:**
```typescript
test.describe('Multiple users', () => {
  roles.forEach(role => {
    test(`Login as ${role}`, async () => {
      const user = testUsers.find(u => u.role === role); // testUsers no disponible
    });
  });
});
```

**✅ Correcto:**
```typescript
test.describe('Multiple users', () => {
  roles.forEach(role => {
    test(`Login as ${role}`, async ({ page }) => {
      const users = await DataProvider.getUserData('test'); // Cargar datos en cada test
      const user = users.find(u => u.role === role);
    });
  });
});
```

## Patrones de Manejo de Errores

### 1. Validación de Datos

```typescript
test('Should process user data', async () => {
  const users = await DataProvider.getUserData('test');
  
  // Validar que hay datos
  if (!users || users.length === 0) {
    test.skip(true, 'No test users available');
    return;
  }
  
  // Validar estructura
  const isValid = DataProvider.validateDataStructure(users, [
    'username', 'password', 'email'
  ]);
  
  if (!isValid) {
    throw new Error('Invalid user data structure');
  }
  
  // Procesar datos...
});
```

### 2. Try-Catch para Operaciones Riesgosas

```typescript
test('Should handle API errors', async () => {
  try {
    const response = await apiClient.getUsers();
    expect(response.status).toBe(200);
  } catch (error) {
    if (error.message.includes('network')) {
      test.skip(true, 'Network error - skipping test');
      return;
    }
    throw error; // Re-throw si no es error esperado
  }
});
```

### 3. Timeouts y Reintentos

```typescript
test('Should handle slow operations', async () => {
  // Configurar timeout específico
  test.setTimeout(60000); // 60 segundos
  
  await expect(async () => {
    const result = await slowOperation();
    expect(result).toBeTruthy();
  }).toPass({
    timeout: 30000,
    intervals: [1000, 2000, 5000] // Reintentos con intervalos
  });
});
```

### 4. Manejo de Elementos No Encontrados

```typescript
test('Should handle missing elements', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  try {
    await loginPage.verifyLoginPageLoaded();
  } catch (error) {
    if (error.message.includes('not found')) {
      await loginPage.takeScreenshot('login-page-not-found');
      throw new Error('Login page elements not found - check selectors');
    }
    throw error;
  }
});
```

## Mejores Prácticas

### 1. Mensajes de Error Descriptivos

```typescript
// ❌ Genérico
expect(result).toBeTruthy();

// ✅ Específico
expect(result, 'Login should return user data').toBeTruthy();
```

### 2. Captura de Evidencias

```typescript
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    // Capturar screenshot
    await page.screenshot({ 
      path: `test-results/failures/${testInfo.title}.png`,
      fullPage: true 
    });
    
    // Capturar logs de consola
    const logs = await page.evaluate(() => {
      return window.console.logs || [];
    });
    
    console.log('Console logs:', logs);
  }
});
```

### 3. Configuración de Ambiente

```typescript
test.beforeAll(async () => {
  // Verificar que el ambiente esté disponible
  try {
    const response = await fetch(process.env.BASE_URL + '/health');
    if (!response.ok) {
      throw new Error(`Environment not ready: ${response.status}`);
    }
  } catch (error) {
    console.error('Environment check failed:', error);
    process.exit(1); // Salir si el ambiente no está listo
  }
});
```

### 4. Limpieza de Datos

```typescript
test.afterEach(async () => {
  // Limpiar datos creados durante el test
  try {
    await cleanupTestData();
  } catch (error) {
    console.warn('Cleanup failed:', error.message);
    // No fallar el test por errores de limpieza
  }
});
```

## Configuración de ESLint

Para evitar errores comunes, configurar ESLint:

```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

## Debugging

### 1. Modo Debug

```bash
# Ejecutar en modo debug
npm run test:debug

# Ejecutar test específico
npx playwright test login.spec.ts --debug
```

### 2. Logs Detallados

```typescript
import { Logger } from '../utils/Logger';

test('Should login successfully', async () => {
  Logger.info('Starting login test');
  Logger.debug('User data:', { username: 'admin' });
  
  try {
    await loginPage.login('admin', 'password');
    Logger.info('Login successful');
  } catch (error) {
    Logger.error('Login failed:', error);
    throw error;
  }
});
```

### 3. Trazas de Playwright

```typescript
test('Should capture trace on failure', async ({ page }) => {
  await page.context().tracing.start({ screenshots: true, snapshots: true });
  
  try {
    // Test logic here
  } catch (error) {
    await page.context().tracing.stop({ path: 'trace.zip' });
    throw error;
  }
});
```

## Conclusión

El manejo adecuado de errores en tests de automatización es crucial para:
- Mantener la estabilidad de la suite de pruebas
- Facilitar el debugging y troubleshooting
- Proporcionar información útil cuando las pruebas fallan
- Evitar falsos positivos y negativos

Siguiendo estos patrones y mejores prácticas, los tests serán más robustos y confiables.
