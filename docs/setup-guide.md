# Guía de Configuración Inicial

Esta guía te ayudará a configurar el proyecto de automatización de pruebas para PaisaERP con Playwright.

## Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Git
- Visual Studio Code (recomendado)

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd test-PaisaERP
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar navegadores de Playwright

```bash
npm run install:browsers
```

### 4. Configurar variables de ambiente

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus configuraciones específicas
# Modificar URLs, credenciales, etc.
```

## Configuración del Proyecto

### Estructura de Carpetas

```
test-PaisaERP/
├── tests/
│   ├── pages/           # Page Object Model
│   ├── specs/           # Archivos de pruebas
│   ├── utils/           # Utilidades y helpers
│   ├── data/            # Datos de prueba
│   └── fixtures/        # Fixtures personalizados
├── config/              # Configuraciones
├── docs/               # Documentación
├── test-results/       # Resultados de pruebas
├── playwright.config.ts # Configuración de Playwright
└── package.json
```

### Configuración de Playwright

El archivo `playwright.config.ts` está configurado con:

- **Múltiples navegadores**: Chrome, Firefox, Safari
- **Ejecución en paralelo**: Optimizada para velocidad
- **Reportes**: HTML, JSON, JUnit
- **Capturas**: Screenshots y videos en fallos
- **Timeouts**: Configurados para aplicaciones ERP

### Page Object Model (POM)

El proyecto utiliza el patrón POM:

- **BasePage**: Clase base con métodos comunes
- **Páginas específicas**: Heredan de BasePage
- **Locators**: Centralizados en cada página
- **Métodos**: Acciones específicas por página

## Comandos Principales

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con interfaz gráfica
npm run test:ui

# Ejecutar en modo debug
npm run test:debug

# Ejecutar con navegador visible
npm run test:headed
```

### Ejecutar por Navegador

```bash
# Solo Chrome
npm run test:chrome

# Solo Firefox
npm run test:firefox

# Solo Safari
npm run test:safari

# Solo móvil
npm run test:mobile
```

### Reportes

```bash
# Ver último reporte
npm run test:report

# Los reportes se generan en:
# - test-results/html-report/
# - test-results/results.json
# - test-results/results.xml
```

### Herramientas de Desarrollo

```bash
# Generar código de prueba
npm run codegen

# Linting
npm run lint

# Formatear código
npm run format

# Limpiar resultados
npm run clean
```

## Configuración de Datos de Prueba

### Usuarios de Prueba

Los datos se encuentran en `tests/data/users-test.json`:

```json
{
  "username": "admin",
  "password": "admin123",
  "role": "administrator",
  "company": "Empresa Principal"
}
```

### Data Providers

Soporta múltiples formatos:

- **JSON**: Para datos estructurados
- **CSV**: Para datasets grandes
- **Excel**: Para datos complejos
- **Generación dinámica**: Para datos únicos

## Integración con CI/CD

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

### Variables de Ambiente CI

```bash
CI=true
HEADLESS=true
PARALLEL_WORKERS=1
RETRY_COUNT=2
```

## Mejores Prácticas

### Nomenclatura

- **Archivos de prueba**: `*.spec.ts`
- **Páginas**: `*Page.ts`
- **Utilidades**: `*Utils.ts`
- **Datos**: `*-data.json`

### Estructura de Pruebas

```typescript
test.describe('Módulo', () => {
  test.beforeEach(async ({ page }) => {
    // Configuración
  });

  test('Descripción clara', async ({ page }) => {
    // Pasos de la prueba
  });

  test.afterEach(async ({ page }) => {
    // Limpieza
  });
});
```

### Manejo de Errores

- Usar `expect()` para verificaciones
- Capturar screenshots en fallos
- Logs detallados para debugging
- Timeouts apropiados

## Solución de Problemas

### Problemas Comunes

1. **Navegadores no instalados**
   ```bash
   npm run install:browsers
   ```

2. **Timeouts**
   - Aumentar timeouts en `playwright.config.ts`
   - Verificar velocidad de red

3. **Elementos no encontrados**
   - Verificar selectores
   - Agregar waits apropiados

4. **Pruebas flaky**
   - Usar `waitFor()` methods
   - Evitar `waitForTimeout()`

### Debugging

```bash
# Modo debug paso a paso
npm run test:debug

# Ver trazas de ejecución
# En el reporte HTML > Ver trace
```

## Recursos Adicionales

- [Documentación de Playwright](https://playwright.dev)
- [Guía de POM](./pom-methodology.md)
- [Data Providers](./data-providers.md)
- [Reportes](./reporting.md)

## Soporte

Para dudas o problemas:
1. Revisar documentación
2. Buscar en issues del repositorio
3. Contactar al equipo de QA
