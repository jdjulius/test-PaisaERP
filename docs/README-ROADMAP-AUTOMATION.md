# 🚀 Guía Paso a Paso: Crear Automatización para Roadmap.sh

Esta guía te ayudará a crear una nueva automatización para el escenario:
1. Abrir https://roadmap.sh/
2. Hacer clic en "Data Analyst"
3. Validar el título "Data Analyst Roadmap"

## 📋 Prerequisitos

- Node.js instalado (versión 18 o superior)
- Proyecto configurado con dependencias instaladas
- Navegadores de Playwright instalados

## 🗂️ Estructura del Proyecto

```
tests/
├── pages/           # Page Object Models
├── specs/           # Archivos de prueba
├── data/            # Datos de prueba
├── fixtures/        # Fixtures y configuraciones
├── types/           # Tipos TypeScript
└── utils/           # Utilidades comunes
```

## 📝 Paso 1: Crear el Page Object Model

### 1.1 Crear el archivo `RoadmapPage.ts`

Crea el archivo en `tests/pages/RoadmapPage.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model para Roadmap.sh
 * Maneja la navegación y interacciones con el sitio
 */
export class RoadmapPage extends BasePage {
  // Selectores de elementos
  readonly dataAnalystLink: Locator;
  readonly pageTitle: Locator;
  readonly mainHeader: Locator;
  readonly roadmapContainer: Locator;

  constructor(page: Page) {
    super(page);
    
    // Definir selectores
    this.dataAnalystLink = page.locator('a[href="/data-analyst"]');
    this.pageTitle = page.locator('h1');
    this.mainHeader = page.locator('header h1');
    this.roadmapContainer = page.locator('[data-testid="roadmap-container"]');
  }

  /**
   * Navegar a la página principal de Roadmap.sh
   */
  async navigateToRoadmap(): Promise<void> {
    await this.navigateTo('https://roadmap.sh/');
    await this.waitForPageLoad();
  }

  /**
   * Hacer clic en el enlace de Data Analyst
   */
  async clickDataAnalyst(): Promise<void> {
    await this.clickElement(this.dataAnalystLink);
    await this.waitForPageLoad();
  }

  /**
   * Validar que el título contiene "Data Analyst Roadmap"
   */
  async validateDataAnalystTitle(): Promise<void> {
    await this.waitForElement(this.pageTitle);
    const titleText = await this.pageTitle.textContent();
    
    expect(titleText).toContain('Data Analyst Roadmap');
  }

  /**
   * Esperar a que la página se cargue completamente
   */
  private async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verificar que estamos en la página correcta
   */
  async verifyPageUrl(): Promise<void> {
    expect(this.page.url()).toContain('/data-analyst');
  }

  /**
   * Obtener el texto del título para verificaciones adicionales
   */
  async getTitleText(): Promise<string> {
    await this.waitForElement(this.pageTitle);
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Verificar que los elementos principales están presentes
   */
  async verifyPageElements(): Promise<void> {
    await this.waitForElement(this.pageTitle);
    await this.waitForElement(this.roadmapContainer);
  }
}
```

### 1.2 Comandos para crear el archivo

```powershell
# Crear el archivo RoadmapPage.ts
New-Item -Path "tests\pages\RoadmapPage.ts" -ItemType File
```

## 📝 Paso 2: Crear el Archivo de Prueba

### 2.1 Crear el archivo `roadmap.spec.ts`

Crea el archivo en `tests/specs/roadmap.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { RoadmapPage } from '../pages/RoadmapPage';

/**
 * Suite de pruebas para Roadmap.sh
 * Validación del flujo de navegación y contenido
 */
test.describe('Roadmap.sh - Data Analyst', () => {
  let roadmapPage: RoadmapPage;

  test.beforeEach(async ({ page }) => {
    roadmapPage = new RoadmapPage(page);
  });

  test('Navegar a Data Analyst y validar título', async ({ page }) => {
    // Paso 1: Abrir https://roadmap.sh/
    await roadmapPage.navigateToRoadmap();
    
    // Paso 2: Hacer clic en Data Analyst
    await roadmapPage.clickDataAnalyst();
    
    // Paso 3: Validar el título "Data Analyst Roadmap"
    await roadmapPage.validateDataAnalystTitle();
    
    // Verificaciones adicionales
    await roadmapPage.verifyPageUrl();
    await roadmapPage.verifyPageElements();
  });

  test('Verificar elementos de la página Data Analyst', async ({ page }) => {
    // Navegar directamente a la página del Data Analyst
    await roadmapPage.navigateTo('https://roadmap.sh/data-analyst');
    
    // Verificar que todos los elementos están presentes
    await roadmapPage.verifyPageElements();
    
    // Obtener y verificar el texto del título
    const titleText = await roadmapPage.getTitleText();
    expect(titleText.toLowerCase()).toContain('data analyst');
  });

  test('Flujo completo con validaciones detalladas', async ({ page }) => {
    // Navegar a la página principal
    await roadmapPage.navigateToRoadmap();
    
    // Tomar screenshot del estado inicial
    await page.screenshot({ path: 'test-results/screenshots/roadmap-home.png' });
    
    // Hacer clic en Data Analyst
    await roadmapPage.clickDataAnalyst();
    
    // Tomar screenshot después del clic
    await page.screenshot({ path: 'test-results/screenshots/data-analyst-page.png' });
    
    // Validar URL
    await roadmapPage.verifyPageUrl();
    
    // Validar título
    await roadmapPage.validateDataAnalystTitle();
    
    // Verificar elementos de la página
    await roadmapPage.verifyPageElements();
    
    // Log de confirmación
    console.log('✅ Prueba completada exitosamente');
  });
});
```

### 2.2 Comandos para crear el archivo

```powershell
# Crear el archivo de prueba
New-Item -Path "tests\specs\roadmap.spec.ts" -ItemType File
```

## 📝 Paso 3: Crear Datos de Prueba (Opcional)

### 3.1 Crear archivo de datos

Crea el archivo en `tests/data/roadmap-data.json`:

```json
{
  "urls": {
    "base": "https://roadmap.sh/",
    "dataAnalyst": "https://roadmap.sh/data-analyst"
  },
  "expectedTexts": {
    "title": "Data Analyst Roadmap",
    "titleVariations": [
      "Data Analyst Roadmap",
      "Data Analyst",
      "roadmap"
    ]
  },
  "selectors": {
    "dataAnalystLink": "a[href='/data-analyst']",
    "alternativeSelectors": [
      "text='Data Analyst'",
      "[data-testid='data-analyst-link']"
    ]
  }
}
```

### 3.2 Comandos para crear el archivo

```powershell
# Crear el archivo de datos
New-Item -Path "tests\data\roadmap-data.json" -ItemType File
```

## 📝 Paso 4: Configurar el Entorno

### 4.1 Actualizar variables de entorno

Agrega las siguientes variables al archivo `.env`:

```bash
# ===== CONFIGURACIÓN DE ROADMAP.SH =====
ROADMAP_BASE_URL=https://roadmap.sh/
ROADMAP_TIMEOUT=10000
ROADMAP_RETRY_COUNT=3

# Configuración para pruebas de Roadmap
TEST_TYPE=roadmap
```

### 4.2 Actualizar package.json

Agrega scripts específicos para las pruebas de Roadmap:

```json
{
  "scripts": {
    "test:roadmap": "TEST_TYPE=roadmap playwright test roadmap.spec.ts",
    "test:roadmap:headed": "TEST_TYPE=roadmap playwright test roadmap.spec.ts --headed",
    "test:roadmap:debug": "TEST_TYPE=roadmap playwright test roadmap.spec.ts --debug",
    "test:roadmap:chrome": "TEST_TYPE=roadmap playwright test roadmap.spec.ts --project=chromium"
  }
}
```

## 🚀 Paso 5: Ejecutar las Pruebas

### 5.1 Comandos de ejecución

```powershell
# Ejecutar la prueba específica
npm run test:roadmap

# Ejecutar con interfaz gráfica
npm run test:roadmap:headed

# Ejecutar en modo debug
npm run test:roadmap:debug

# Ejecutar solo en Chrome
npm run test:roadmap:chrome

# Ejecutar todas las pruebas
npm test
```

### 5.2 Verificar resultados

```powershell
# Ver el reporte HTML
npm run test:report

# Ver los screenshots generados
dir test-results\screenshots\

# Ver el reporte específico
start test-results\html-report\index.html
```

## 🔍 Paso 6: Validación y Debugging

### 6.1 Verificar que los selectores funcionan

```typescript
// En el archivo RoadmapPage.ts, agregar método de debugging
async debugSelectors(): Promise<void> {
  console.log('Verificando selectores...');
  
  // Verificar que el enlace existe
  const linkExists = await this.dataAnalystLink.isVisible();
  console.log(`Data Analyst link visible: ${linkExists}`);
  
  // Verificar URL actual
  console.log(`Current URL: ${this.page.url()}`);
  
  // Verificar título
  const title = await this.getTitleText();
  console.log(`Page title: ${title}`);
}
```

### 6.2 Comandos de debugging

```powershell
# Generar código automáticamente
npx playwright codegen https://roadmap.sh/

# Ejecutar en modo debug paso a paso
npx playwright test roadmap.spec.ts --debug

# Ejecutar con trace viewer
npx playwright test roadmap.spec.ts --trace on
```

## 📊 Paso 7: Reportes y Evidencias

### 7.1 Configurar reportes personalizados

Las pruebas generarán automáticamente:
- Screenshots en cada paso importante
- Videos de la ejecución
- Reporte HTML con detalles
- Logs de consola

### 7.2 Ubicación de reportes

```
test-results/
├── html-report/         # Reporte HTML principal
├── screenshots/         # Capturas de pantalla
├── videos/             # Videos de ejecución
└── traces/             # Trazas para debugging
```

## 🛠️ Paso 8: Mejores Prácticas

### 8.1 Manejo de errores

```typescript
// Agregar try-catch para manejo robusto
async clickDataAnalyst(): Promise<void> {
  try {
    await this.clickElement(this.dataAnalystLink);
    await this.waitForPageLoad();
  } catch (error) {
    console.error('Error al hacer clic en Data Analyst:', error);
    // Intentar selector alternativo
    await this.page.click('text="Data Analyst"');
  }
}
```

### 8.2 Esperas inteligentes

```typescript
// Usar waitForSelector con condiciones específicas
async waitForDataAnalystPage(): Promise<void> {
  await this.page.waitForFunction(() => {
    return document.title.includes('Data Analyst') && 
           document.readyState === 'complete';
  });
}
```

### 8.3 Configuración de timeouts

```typescript
// En playwright.config.ts
export default defineConfig({
  timeout: 30000, // 30 segundos por prueba
  expect: {
    timeout: 10000 // 10 segundos para assertions
  }
});
```

## 📋 Checklist Final

- [ ] ✅ Page Object Model creado (`RoadmapPage.ts`)
- [ ] ✅ Archivo de prueba creado (`roadmap.spec.ts`)
- [ ] ✅ Datos de prueba configurados (`roadmap-data.json`)
- [ ] ✅ Variables de entorno actualizadas (`.env`)
- [ ] ✅ Scripts de npm configurados (`package.json`)
- [ ] ✅ Pruebas ejecutadas exitosamente
- [ ] ✅ Reportes generados y verificados
- [ ] ✅ Screenshots y videos capturados
- [ ] ✅ Debugging completado
- [ ] ✅ Documentación actualizada

## 🎯 Comandos Rápidos

```powershell
# Setup completo
npm install
npm run install:browsers
cp .env.example .env

# Ejecutar la nueva automatización
npm run test:roadmap:headed

# Ver reportes
npm run test:report
```

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que los selectores son correctos
2. Ejecuta en modo debug para ver el flujo
3. Revisa los logs de consola
4. Comprueba que la página web no haya cambiado

¡Listo! Ya tienes tu automatización para Roadmap.sh funcionando. 🚀
