# Test-PaisaERP - Automatización de Pruebas Roadmap.sh

Proyecto de automatización de pruebas E2E para Roadmap.sh utilizando Playwright y TypeScript, siguiendo las mejores prácticas del Page Object Model (POM).

## 🚀 Características

- **Framework**: Playwright con TypeScript
- **Patrón**: Page Object Model (POM) - 1 Page = 1 Class = 1 Spec
- **Ejecución**: Paralela y optimizada
- **Reportes**: HTML, JSON, JUnit con capturas y videos
- **Data Providers**: JSON para datos de prueba
- **CI/CD**: Integración con GitHub Actions
- **Seguridad**: 0 vulnerabilities - xlsx dependency removed

## 📋 Módulos Cubiertos

- **Home Page**: Navegación y enlaces principales de Roadmap.sh
- **Data Analyst Page**: Roadmap específico para analistas de datos
- **Login Page**: Autenticación y gestión de sesiones
- **Google Search**: Búsquedas especializadas en Google
- **E2E Flows**: Flujos completos de navegación entre páginas

## 🛠️ Instalación Rápida

```bash
# Clonar repositorio
git clone <repository-url>
cd test-PaisaERP

# Instalar dependencias
npm install

# Instalar navegadores
npm run install:browsers

# Configurar ambiente
cp .env.example .env
```

## 🧪 Ejecución de Pruebas

### Comandos Principales

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas específicas
npm run test:home          # Solo Home Page
npm run test:data-analyst  # Solo Data Analyst Page  
npm run test:login         # Solo Login Page
npm run test:flow          # Solo E2E Flow

# Modo interactivo
npm run test:ui

# Debug paso a paso
npm run test:debug

# Con navegador visible
npm run test:headed
```

### Por Navegador

```bash
npm run test:chrome    # Solo Chrome
npm run test:firefox   # Solo Firefox
npm run test:safari    # Solo Safari
npm run test:mobile    # Dispositivos móviles
```

### Reportes

```bash
npm run test:report    # Ver último reporte
```

## 📁 Estructura del Proyecto

```
test-PaisaERP/
├── tests/
│   ├── pages/              # Page Object Model
│   │   ├── BasePage.ts     # Clase base
│   │   ├── HomePage.ts     # Página principal Roadmap.sh
│   │   ├── DataAnalystPage.ts # Página Data Analyst
│   │   ├── LoginPage.ts    # Página de Login
│   │   └── GooglePage.ts   # Página de Google Search
│   ├── specs/              # Archivos de pruebas
│   │   ├── home.spec.ts    # Pruebas Home Page
│   │   ├── data-analyst.spec.ts # Pruebas Data Analyst Page
│   │   ├── login.spec.ts   # Pruebas Login Page
│   │   ├── complete-flow.spec.ts # Pruebas E2E Flow
│   │   └── google-search.spec.ts # Pruebas Google Search
│   ├── utils/              # Utilidades
│   │   └── DataProvider.ts # Manejo de datos
│   ├── data/               # Datos de prueba
│   │   └── users-test.json # Usuarios de prueba
│   └── fixtures/           # Fixtures personalizados
├── docs/                   # Documentación
├── config/                 # Configuraciones
├── playwright.config.ts    # Configuración Playwright
└── package.json
```

## 🔧 Configuración

### Variables de Ambiente

```bash
# URLs por ambiente
BASE_URL=https://roadmap.sh
DEV_URL=http://localhost:3000
TEST_URL=http://test.paisaerp.com

# Configuración de ejecución
PARALLEL_WORKERS=4
TIMEOUT=30000
HEADLESS=true
```

### Configuración de Playwright

- ✅ Múltiples navegadores (Chrome, Firefox, Safari)
- ✅ Ejecución en paralelo
- ✅ Capturas automáticas en fallos
- ✅ Videos de pruebas
- ✅ Trazas para debugging
- ✅ Reportes detallados

## 📊 Data Providers

### Formatos Soportados

- **JSON**: Datos estructurados
- **CSV**: Datasets grandes
- **Excel**: Datos complejos
- **Dinámicos**: Generación automática

### Ejemplo de Uso

```typescript
// Cargar datos de usuarios
const users = await DataProvider.getUserData('test');

// Generar datos aleatorios
const email = DataProvider.generateRandomData('email');

// Filtrar datos por criterio
const admins = DataProvider.filterData(users, { role: 'admin' });
```

## 🧩 Page Object Model

### Estructura Base

```typescript
// Clase base con métodos comunes
export class BasePage {
  async clickElement(locator: Locator): Promise<void>
  async fillField(locator: Locator, text: string): Promise<void>
  async verifyElementVisible(locator: Locator): Promise<void>
}

// Página específica
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  
  async login(username: string, password: string): Promise<void>
  async verifyLoginSuccess(): Promise<void>
}
```

### Ventajas

- ✅ Código reutilizable
- ✅ Fácil mantenimiento
- ✅ Tests legibles
- ✅ Escalabilidad

## 🔄 Integración CI/CD

### GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run install:browsers
      - run: npm test
```

### Configuración CI

- Ejecución automática en commits
- Reportes integrados
- Notificaciones de fallos
- Artefactos de evidencia

## 📈 Reportes y Evidencias

### Tipos de Reportes

- **HTML**: Reporte interactivo detallado
- **JSON**: Para integración con herramientas
- **JUnit**: Para sistemas de CI/CD
- **Console**: Output en tiempo real

### Evidencias

- Screenshots automáticos en fallos
- Videos de ejecución completa
- Trazas detalladas para debugging
- Logs estructurados

## 🎯 Mejores Prácticas

### Nomenclatura

- Tests: `*.spec.ts`
- Páginas: `*Page.ts`
- Datos: `*-data.json`
- Utilidades: `*Utils.ts`

### Estructura de Tests

```typescript
test.describe('Módulo', () => {
  test.beforeEach(async ({ page }) => {
    // Configuración inicial
  });

  test('Descripción clara del caso', async ({ page }) => {
    // Pasos del test
  });

  test.afterEach(async ({ page }) => {
    // Limpieza
  });
});
```

### Manejo de Errores

- Usar `expect()` para verificaciones
- Timeouts apropiados
- Capturas en fallos
- Logs detallados

## 📚 Documentación

- [Guía de Configuración](./docs/setup-guide.md)
- [Metodología POM](./docs/pom-methodology.md)
- [Data Providers](./docs/data-providers.md)
- [Sistema de Reportes](./docs/reporting.md)
- [Ejecución en Paralelo](./docs/parallel-execution.md)

## 🤝 Contribución

### Agregar Nuevas Pruebas

1. Crear Page Object en `tests/pages/`
2. Agregar datos de prueba en `tests/data/`
3. Crear spec en `tests/specs/`
4. Actualizar documentación

### Convenciones

- Usar TypeScript estricto
- Seguir patrón POM
- Documentar métodos complejos
- Crear datos de prueba apropiados

## 🛠️ Solución de Problemas

### Problemas Comunes

1. **Navegadores no instalados**
   ```bash
   npm run install:browsers
   ```

2. **Timeouts**
   - Verificar configuración de red
   - Ajustar timeouts en config

3. **Elementos no encontrados**
   - Verificar selectores
   - Agregar waits apropiados

### Debugging

```bash
# Modo debug interactivo
npm run test:debug

# Generar código de prueba
npm run codegen

# Ver trazas en reporte HTML
npm run test:report
```

## 📞 Soporte

Para dudas o problemas:
1. Revisar documentación
2. Buscar en issues del repositorio
3. Contactar al equipo de QA

---

**Desarrollado por**: Equipo de QA  
**Tecnologías**: Playwright, TypeScript, Node.js  
**Licencia**: MIT