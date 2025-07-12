# Metodología Page Object Model (POM)

## ¿Qué es Page Object Model?

Page Object Model (POM) es un patrón de diseño que crea un repositorio de objetos para elementos de la interfaz web. Bajo este modelo, para cada página web de la aplicación, debe haber una clase correspondiente que encuentra los elementos web de esa página y también contiene métodos que realizan operaciones en esos elementos.

## Ventajas del POM

### 1. **Reutilización de Código**
- Los métodos y locators se pueden reutilizar en múltiples tests
- Reduce la duplicación de código
- Facilita el mantenimiento

### 2. **Mantenibilidad**
- Cuando cambia un elemento en la UI, solo necesitas actualizar el Page Object
- No necesitas cambiar todos los tests que usan ese elemento

### 3. **Legibilidad**
- Los tests son más legibles y fáciles de entender
- Separación clara entre la lógica de UI y la lógica de test

### 4. **Escalabilidad**
- Fácil agregar nuevas páginas y funcionalidades
- Estructura organizada para proyectos grandes

## Estructura del POM en nuestro proyecto

### Jerarquía de Clases

```
BasePage (Clase base)
├── LoginPage
├── DashboardPage
├── UserManagementPage
├── ReportsPage
└── SettingsPage
```

### Clase BasePage

```typescript
export class BasePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  // Métodos comunes para todas las páginas
  async navigateTo(url: string): Promise<void>
  async waitForElement(locator: Locator): Promise<void>
  async clickElement(locator: Locator): Promise<void>
  async fillField(locator: Locator, text: string): Promise<void>
  // ... más métodos comunes
}
```

### Página Específica

```typescript
export class LoginPage extends BasePage {
  // Locators específicos de la página
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-btn');
  }

  // Métodos específicos de la página
  async login(username: string, password: string): Promise<void>
  async verifyLoginSuccess(): Promise<void>
  // ... más métodos específicos
}
```

## Principios del POM

### 1. **Encapsulación**
- Cada página debe encapsular sus propios elementos y operaciones
- No exponer detalles internos de implementación

### 2. **Abstracción**
- Los tests no deben saber cómo interactuar con elementos específicos
- Los Page Objects proporcionan una interfaz clara

### 3. **Responsabilidad Única**
- Cada Page Object es responsable de una sola página
- Cada método debe tener una responsabilidad específica

### 4. **Reutilización**
- Los métodos deben ser genéricos y reutilizables
- Evitar lógica específica de test en Page Objects

## Mejores Prácticas

### Nomenclatura

```typescript
// Páginas
export class LoginPage extends BasePage
export class DashboardPage extends BasePage

// Locators - usar nombres descriptivos
readonly usernameInput: Locator;
readonly submitButton: Locator;
readonly errorMessage: Locator;

// Métodos - usar verbos descriptivos
async login(username: string, password: string)
async verifyLoginSuccess()
async getErrorMessage()
```

### Organización de Locators

```typescript
export class LoginPage extends BasePage {
  // Agrupar locators por sección
  // Campos de entrada
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly companySelect: Locator;
  
  // Botones
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  
  // Mensajes
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  
  // Checkboxes
  readonly rememberMeCheckbox: Locator;
}
```

### Métodos de Página

```typescript
// Métodos que realizan acciones
async login(username: string, password: string): Promise<void>
async selectCompany(company: string): Promise<void>
async clickForgotPassword(): Promise<void>

// Métodos que obtienen información
async getErrorMessage(): Promise<string>
async isLoginButtonEnabled(): Promise<boolean>
async getCompanyOptions(): Promise<string[]>

// Métodos que verifican estado
async verifyLoginPageLoaded(): Promise<void>
async verifyLoginSuccess(): Promise<void>
async verifyLoginError(expectedMessage: string): Promise<void>
```

## Ejemplo de Implementación

### 1. Crear Page Object

```typescript
// tests/pages/UserManagementPage.ts
export class UserManagementPage extends BasePage {
  readonly addUserButton: Locator;
  readonly userTable: Locator;
  readonly searchInput: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addUserButton = page.locator('#add-user-btn');
    this.userTable = page.locator('#users-table');
    this.searchInput = page.locator('#search-users');
    this.nameInput = page.locator('#user-name');
    this.emailInput = page.locator('#user-email');
    this.roleSelect = page.locator('#user-role');
    this.saveButton = page.locator('#save-user');
  }

  async navigateToUsers(): Promise<void> {
    await this.navigateTo('/users');
    await this.waitForPageLoad();
  }

  async addNewUser(userData: UserData): Promise<void> {
    await this.clickElement(this.addUserButton);
    await this.fillField(this.nameInput, userData.name);
    await this.fillField(this.emailInput, userData.email);
    await this.selectOption(this.roleSelect, userData.role);
    await this.clickElement(this.saveButton);
  }

  async searchUser(searchTerm: string): Promise<void> {
    await this.fillField(this.searchInput, searchTerm);
    await this.wait(1000); // Esperar por filtrado
  }

  async verifyUserExists(username: string): Promise<void> {
    const userRow = this.userTable.locator(`tr:has-text("${username}")`);
    await this.verifyElementVisible(userRow);
  }
}
```

### 2. Usar en Tests

```typescript
// tests/specs/user-management.spec.ts
import { test, expect } from '@playwright/test';
import { UserManagementPage } from '../pages/UserManagementPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('User Management', () => {
  let userManagementPage: UserManagementPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    userManagementPage = new UserManagementPage(page);
    
    // Login como admin
    await loginPage.navigateToLogin();
    await loginPage.login('admin', 'admin123');
    await userManagementPage.navigateToUsers();
  });

  test('Should add new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    };

    await userManagementPage.addNewUser(userData);
    await userManagementPage.verifyUserExists(userData.name);
  });

  test('Should search for existing user', async () => {
    await userManagementPage.searchUser('admin');
    await userManagementPage.verifyUserExists('admin');
  });
});
```

## Patrones Avanzados

### Page Factory Pattern

```typescript
export class PageFactory {
  static createPage<T extends BasePage>(
    pageClass: new (page: Page) => T,
    page: Page
  ): T {
    return new pageClass(page);
  }
}

// Uso
const loginPage = PageFactory.createPage(LoginPage, page);
```

### Page Components

```typescript
// Para componentes reutilizables
export class NavigationComponent {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly profileLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.locator('#nav-home');
    this.profileLink = page.locator('#nav-profile');
    this.logoutLink = page.locator('#nav-logout');
  }

  async navigateToHome(): Promise<void> {
    await this.homeLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}
```

## Consejos Adicionales

### 1. **Manejo de Waits**
```typescript
// Usar waits apropiados
await this.page.waitForSelector('#element');
await this.page.waitForLoadState('networkidle');
```

### 2. **Manejo de Errores**
```typescript
async clickElement(locator: Locator): Promise<void> {
  try {
    await this.waitForElement(locator);
    await locator.click();
  } catch (error) {
    throw new Error(`Failed to click element: ${error.message}`);
  }
}
```

### 3. **Logging**
```typescript
import { Logger } from '../utils/Logger';

async login(username: string, password: string): Promise<void> {
  Logger.info(`Attempting login with user: ${username}`);
  await this.fillField(this.usernameInput, username);
  await this.fillField(this.passwordInput, password);
  await this.clickElement(this.loginButton);
  Logger.info('Login completed');
}
```

## Conclusión

El patrón Page Object Model es fundamental para mantener tests organizados, mantenibles y escalables. Siguiendo estas prácticas, el equipo puede crear una suite de pruebas robusta que crezca con el proyecto sin volverse inmanejable.
