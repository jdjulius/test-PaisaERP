# Configuración Unificada de Playwright

## 🎯 Descripción

Este documento describe la configuración unificada de Playwright que reemplaza los múltiples archivos de configuración por una sola configuración adaptativa que funciona para:

- **Desarrollo local** (`NODE_ENV=development`)
- **CI/CD** (`CI=true`)
- **Pruebas de Google Search** (`TEST_TYPE=google`)
- **Pruebas completas de CI** (`FULL_CI=true`)

## 📋 Configuraciones Anteriores Consolidadas

| Archivo Anterior | Propósito | Ahora Controlado Por |
|------------------|-----------|---------------------|
| `playwright.config.ts` | Configuración principal | Variables de entorno |
| `playwright.config.dev.ts` | Desarrollo local | `NODE_ENV=development` |
| `playwright.config.ci.ts` | CI/CD | `CI=true` |
| `playwright.config.google.ts` | Pruebas de Google | `TEST_TYPE=google` |

## 🌍 Variables de Entorno

### Variables Principales

| Variable | Valores | Descripción |
|----------|---------|-------------|
| `NODE_ENV` | `development`, `test`, `production` | Ambiente de ejecución |
| `TEST_TYPE` | `google`, `undefined` | Tipo de pruebas a ejecutar |
| `CI` | `true`, `false` | Indica si está en CI/CD |
| `FULL_CI` | `true`, `false` | Ejecuta pruebas completas en CI |

### Variables de Configuración

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `BASE_URL` | URL base para pruebas del ERP | `http://localhost:3000` |
| `API_BASE_URL` | URL base para pruebas de API | `http://localhost:3000/api` |
| `GITHUB_RUN_ID` | ID del build en GitHub Actions | `unknown` |
| `GITHUB_REF_NAME` | Nombre de la rama | `unknown` |
| `GITHUB_SHA` | Hash del commit | `unknown` |

## 🎮 Comandos Actualizados

### Comandos Básicos
```bash
# Pruebas normales
npm run test

# Pruebas con navegador visible
npm run test:headed

# Modo debug
npm run test:debug

# Interfaz gráfica
npm run test:ui
```

### Comandos por Navegador
```bash
# Solo Chrome
npm run test:chrome

# Solo Firefox
npm run test:firefox

# Solo Safari (WebKit)
npm run test:safari

# Solo móvil
npm run test:mobile

# Solo API tests
npm run test:api
```

### Comandos de Desarrollo
```bash
# Modo desarrollo (navegador visible, sin paralelismo)
npm run test:dev

# Modo desarrollo con debug
npm run test:dev:debug
```

### Comandos de CI/CD
```bash
# CI básico
npm run test:ci

# CI completo (incluye todos los navegadores)
npm run test:ci:full
```

### Comandos de Google Search
```bash
# Pruebas de Google básicas
npm run test:google

# Pruebas de Google con navegador visible
npm run test:google:headed

# Pruebas de Google en modo debug
npm run test:google:debug

# Pruebas de Google solo en Chrome
npm run test:google:chrome

# Pruebas de Google solo en Firefox
npm run test:google:firefox

# Pruebas de Google solo en móvil
npm run test:google:mobile
```

## ⚙️ Configuraciones Adaptativas

### Timeouts por Ambiente

| Ambiente | Test Timeout | Expect Timeout | Action Timeout | Navigation Timeout |
|----------|--------------|----------------|----------------|--------------------|
| **Desarrollo** | 60s | 10s | 15s | 30s |
| **Google** | 45s | 8s | 15s | 30s |
| **CI** | 45s | 8s | 12s | 20s |
| **Normal** | 30s | 5s | 10s | 15s |

### Workers y Paralelismo

| Ambiente | Workers | Parallel | Retries |
|----------|---------|----------|---------|
| **Desarrollo** | 1 | false | 0 |
| **Google + CI** | 1 | true | 3 |
| **Google** | 2 | true | 1 |
| **CI** | 1 | true | 2 |
| **Normal** | 4 | true | 0 |

### Navegadores por Ambiente

| Ambiente | Chrome | Firefox | Safari | Mobile |
|----------|--------|---------|--------|---------|
| **Desarrollo** | ✅ | ❌ | ❌ | ❌ |
| **Google** | ✅ | ✅ | ❌ | ✅ |
| **CI Normal** | ✅ | ✅ | ❌ | ❌ |
| **CI Completo** | ✅ | ✅ | ✅ | ✅ |

## 🔧 Configuraciones Específicas

### Configuración de Google Search

Cuando `TEST_TYPE=google`:
- Sin `baseURL` (permite navegación externa)
- User-Agent realista de Chrome
- Headers HTTP adicionales para simular navegador real
- Viewport de 1366x768
- Bypass CSP habilitado
- Argumentos de Chrome anti-detección

### Configuración de Desarrollo

Cuando `NODE_ENV=development`:
- Navegador visible (`headless: false`)
- Slow motion 100ms
- Un solo worker (mejor para debugging)
- Reportes HTML abiertos automáticamente
- WebServer reutilizable

### Configuración de CI

Cuando `CI=true`:
- Reportes adicionales (JUnit, GitHub)
- Navegador headless
- Configuraciones optimizadas para recursos limitados
- Sin WebServer (se asume que está corriendo)

## 📊 Reportes Adaptativos

### Reportes por Ambiente

| Ambiente | HTML | JSON | JUnit | GitHub | List |
|----------|------|------|-------|---------|------|
| **Desarrollo** | ✅ (abierto) | ✅ | ❌ | ❌ | ✅ |
| **Google** | ✅ (google-search-report) | ✅ | ❌ | ❌ | ✅ |
| **CI** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Normal** | ✅ | ✅ | ❌ | ❌ | ✅ |

### Ubicación de Reportes

| Tipo | Ubicación |
|------|-----------|
| **ERP HTML** | `test-results/html-report` |
| **Google HTML** | `test-results/google-search-report` |
| **ERP JSON** | `test-results/results.json` |
| **Google JSON** | `test-results/google-search-results.json` |
| **JUnit** | `test-results/results.xml` |
| **Artefactos ERP** | `test-results/artifacts` |
| **Artefactos Google** | `test-results/google-artifacts` |

## 🚀 Ejemplos de Uso

### Desarrollo Local
```bash
# Desarrollo con navegador visible
NODE_ENV=development npm run test:dev

# Debug de un test específico
NODE_ENV=development npm run test:debug -- tests/specs/login.spec.ts
```

### Pruebas de Google
```bash
# Pruebas de Google en ambiente local
TEST_TYPE=google npm run test:google:headed

# Pruebas de Google en CI
TEST_TYPE=google CI=true npm run test:google
```

### CI/CD
```bash
# CI básico (Chrome + Firefox)
CI=true npm run test:ci

# CI completo (todos los navegadores)
CI=true FULL_CI=true npm run test:ci:full
```

### Combinaciones Avanzadas
```bash
# Google en CI con todos los navegadores
TEST_TYPE=google CI=true FULL_CI=true npm run test:google

# Desarrollo con API tests
NODE_ENV=development npm run test:api
```

## 🛠️ Troubleshooting

### Problemas Comunes

1. **"Cannot find baseURL"**
   - Solución: Establecer `BASE_URL` o usar `TEST_TYPE=google`

2. **"WebServer timeout"**
   - Solución: Usar `CI=true` o verificar que el servidor esté corriendo

3. **"Too many workers"**
   - Solución: Usar `NODE_ENV=development` o `CI=true`

### Variables de Debug

```bash
# Ver configuración actual
DEBUG=pw:test npm run test

# Ver configuración de navegador
DEBUG=pw:browser npm run test
```

## 📈 Ventajas de la Configuración Unificada

### ✅ Beneficios

- **Simplicidad**: Un solo archivo de configuración
- **Mantenibilidad**: Cambios centralizados
- **Flexibilidad**: Adaptable a diferentes ambientes
- **Consistencia**: Configuraciones coherentes
- **Escalabilidad**: Fácil agregar nuevos ambientes

### 🔄 Migración Completada

- ❌ `playwright.config.dev.ts` → Eliminado
- ❌ `playwright.config.ci.ts` → Eliminado  
- ❌ `playwright.config.google.ts` → Eliminado
- ✅ `playwright.config.ts` → Configuración unificada

## 📝 Próximos Pasos

1. Probar la configuración en diferentes ambientes
2. Ajustar timeouts según las necesidades del proyecto
3. Configurar variables de entorno en CI/CD
4. Documentar tests específicos para cada ambiente
