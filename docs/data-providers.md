# Data Providers - Guía de Uso

## Introducción

La clase `DataProvider` proporciona utilidades para manejar datos de prueba en múltiples formatos (JSON, CSV, Excel) y generar datos dinámicos para las pruebas de automatización.

## Instalación de Dependencias

```bash
npm install xlsx csv-parser
npm install --save-dev @types/node
```

## Estructura de Datos

### Directorio de Datos

```
tests/
└── data/
    ├── users-test.json        # Usuarios de prueba
    ├── users-dev.json         # Usuarios de desarrollo
    ├── products-testdata.json # Datos de productos
    ├── customers.csv          # Datos de clientes en CSV
    └── inventory.xlsx         # Inventario en Excel
```

## Métodos Disponibles

### 1. Leer Datos JSON

```typescript
import { DataProvider } from '../utils/DataProvider';

// Leer archivo JSON específico
const users = await DataProvider.readJsonData('users-test.json');

// Obtener usuarios por ambiente
const testUsers = await DataProvider.getUserData('test');
const devUsers = await DataProvider.getUserData('dev');

// Obtener datos de módulo específico
const productData = await DataProvider.getModuleTestData('products');
```

### 2. Leer Datos CSV

```typescript
// Leer archivo CSV completo
const customers = await DataProvider.readCsvData('customers.csv');

// Ejemplo de archivo CSV (customers.csv):
/*
name,email,phone,company
Juan Pérez,juan@example.com,+573001234567,Empresa A
María García,maria@example.com,+573007654321,Empresa B
*/
```

### 3. Leer Datos Excel

```typescript
// Leer primera hoja
const inventory = await DataProvider.readExcelData('inventory.xlsx');

// Leer hoja específica
const sales = await DataProvider.readExcelData('reports.xlsx', 'Sales');

// Estructura esperada del Excel:
/*
| Product | Price | Stock | Category |
|---------|-------|-------|----------|
| Item 1  | 100   | 50    | Tech     |
| Item 2  | 200   | 30    | Office   |
*/
```

### 4. Generar Datos Aleatorios

```typescript
// Generar diferentes tipos de datos
const randomEmail = DataProvider.generateRandomData('email');
// Resultado: test1642345678901@ejemplo.com

const randomPhone = DataProvider.generateRandomData('phone');
// Resultado: +573001234567

const randomName = DataProvider.generateRandomData('name');
// Resultado: Usuario1642345678901

const randomCompany = DataProvider.generateRandomData('company');
// Resultado: Empresa1642345678901

const randomDocument = DataProvider.generateRandomData('document');
// Resultado: 12345678
```

### 5. Filtrar Datos

```typescript
const users = await DataProvider.getUserData('test');

// Filtrar por rol
const admins = DataProvider.filterData(users, { role: 'administrator' });

// Filtrar por múltiples criterios
const activeUsers = DataProvider.filterData(users, { 
  active: true, 
  company: 'Empresa Principal' 
});
```

### 6. Validar Estructura

```typescript
const users = await DataProvider.getUserData('test');

// Validar campos requeridos
const isValid = DataProvider.validateDataStructure(users, [
  'username', 'password', 'email', 'role'
]);

if (!isValid) {
  throw new Error('Estructura de datos inválida');
}
```

### 7. Crear Archivos de Datos

```typescript
// Crear archivo de ejemplo
const sampleUsers = [
  {
    username: 'test1',
    password: 'pass123',
    email: 'test1@example.com',
    role: 'user'
  },
  {
    username: 'test2',
    password: 'pass456',
    email: 'test2@example.com',
    role: 'admin'
  }
];

await DataProvider.createSampleDataFile('new-users.json', sampleUsers);
```

## Ejemplos de Uso en Tests

### Test con Datos JSON

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DataProvider } from '../utils/DataProvider';

test.describe('Login Tests', () => {
  test('Login with multiple users', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const users = await DataProvider.getUserData('test');
    
    for (const user of users) {
      if (user.active) {
        await loginPage.navigateToLogin();
        await loginPage.login(user.username, user.password);
        await loginPage.verifyLoginSuccess();
        await loginPage.logout();
      }
    }
  });
});
```

### Test con Datos CSV

```typescript
test('Process customer data', async ({ page }) => {
  const customers = await DataProvider.readCsvData('customers.csv');
  
  for (const customer of customers) {
    await customerPage.addCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company
    });
  }
});
```

### Test con Datos Excel

```typescript
test('Update inventory', async ({ page }) => {
  const inventory = await DataProvider.readExcelData('inventory.xlsx');
  
  for (const item of inventory) {
    await inventoryPage.updateProduct(item.Product, {
      price: item.Price,
      stock: item.Stock,
      category: item.Category
    });
  }
});
```

### Test con Datos Dinámicos

```typescript
test('Create user with random data', async ({ page }) => {
  const userData = {
    name: DataProvider.generateRandomData('name'),
    email: DataProvider.generateRandomData('email'),
    phone: DataProvider.generateRandomData('phone'),
    company: DataProvider.generateRandomData('company')
  };
  
  await userPage.createUser(userData);
  await userPage.verifyUserCreated(userData.name);
});
```

### Test Parametrizado

```typescript
test.describe('Parametrized Tests', () => {
  let testData: any[];
  
  test.beforeAll(async () => {
    testData = await DataProvider.getModuleTestData('products');
  });
  
  for (const data of testData) {
    test(`Test with ${data.name}`, async ({ page }) => {
      await productPage.createProduct(data);
      await productPage.verifyProductExists(data.name);
    });
  }
});
```

## Configuración por Ambiente

### Archivos por Ambiente

```
tests/data/
├── users-dev.json     # Datos de desarrollo
├── users-test.json    # Datos de testing
├── users-staging.json # Datos de staging
└── users-prod.json    # Datos de producción
```

### Uso en Tests

```typescript
const environment = process.env.NODE_ENV || 'test';
const users = await DataProvider.getUserData(environment);
```

## Mejores Prácticas

### 1. Estructura de Archivos JSON

```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "password": "admin123",
      "email": "admin@example.com",
      "role": "administrator",
      "active": true,
      "permissions": ["read", "write", "delete"],
      "profile": {
        "firstName": "Admin",
        "lastName": "User",
        "department": "IT"
      }
    }
  ]
}
```

### 2. Validación de Datos

```typescript
// Siempre validar antes de usar
const users = await DataProvider.getUserData('test');
const isValid = DataProvider.validateDataStructure(users, [
  'username', 'password', 'email'
]);

if (!isValid) {
  throw new Error('Invalid user data structure');
}
```

### 3. Manejo de Errores

```typescript
try {
  const data = await DataProvider.readJsonData('nonexistent.json');
} catch (error) {
  console.error('Error loading data:', error.message);
  // Usar datos por defecto o saltear el test
}
```

### 4. Datos Sensibles

```typescript
// NO incluir contraseñas reales en archivos de datos
// Usar datos de prueba específicos
{
  "username": "test_user",
  "password": "test_password_123", // Solo para testing
  "email": "test@example.com"       // Email de prueba
}
```

## Integración con Fixtures

```typescript
// En fixtures/erp-fixtures.ts
export const test = base.extend<ERPFixtures>({
  testUsers: async ({}, use) => {
    const users = await DataProvider.getUserData('test');
    await use(users);
  },
  
  randomUser: async ({}, use) => {
    const user = {
      name: DataProvider.generateRandomData('name'),
      email: DataProvider.generateRandomData('email'),
      phone: DataProvider.generateRandomData('phone')
    };
    await use(user);
  }
});
```

## Troubleshooting

### Errores Comunes

1. **Archivo no encontrado**
   ```
   Error: Archivo no encontrado: /path/to/file.json
   ```
   - Verificar que el archivo existe en `tests/data/`
   - Verificar el nombre del archivo

2. **Formato JSON inválido**
   ```
   Error: Unexpected token in JSON
   ```
   - Validar formato JSON con un validador online
   - Verificar comas y comillas

3. **Hoja Excel no encontrada**
   ```
   Error: Hoja no encontrada: SheetName
   ```
   - Verificar nombre de la hoja en Excel
   - Usar la primera hoja por defecto

### Debugging

```typescript
// Agregar logs para debug
console.log('Loading data from:', filename);
const data = await DataProvider.readJsonData(filename);
console.log('Data loaded:', data.length, 'records');
```

## Contribución

Para agregar nuevos métodos al DataProvider:

1. Mantener consistencia con métodos existentes
2. Agregar documentación JSDoc
3. Incluir manejo de errores
4. Agregar tests unitarios
5. Actualizar esta documentación
