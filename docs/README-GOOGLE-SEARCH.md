# 🚀 Pruebas de Google Search - Analista de Datos

Este proyecto incluye pruebas automatizadas para realizar búsquedas en Google del puesto de **Analista de Datos**, utilizando Playwright y siguiendo mejores prácticas de automatización.

## 📋 Características Principales

- ✅ **Page Object Model (POM)** para Google Search
- ✅ **Pruebas Data-Driven** con archivos JSON
- ✅ **Múltiples navegadores** (Chrome, Firefox, Safari, Mobile)
- ✅ **Configuración anti-bot** para evitar detección
- ✅ **Geolocalización** específica para México
- ✅ **Métricas de rendimiento** detalladas
- ✅ **Reportes HTML** con capturas de pantalla

## 🏗️ Estructura del Proyecto

```
tests/
├── pages/
│   ├── BasePage.ts          # Clase base para POM
│   └── GooglePage.ts        # Page Object para Google
├── specs/
│   ├── google-search.spec.ts         # Pruebas básicas
│   └── google-search-advanced.spec.ts # Pruebas avanzadas
├── data/
│   └── google-search-data.json       # Datos de prueba
└── utils/
    └── DataProvider.ts      # Utilidad para datos
```

## 🔧 Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Instalar navegadores de Playwright**:
```bash
npm run install:browsers
```

3. **Instalar dependencias del sistema**:
```bash
npm run install:deps
```

## 🚀 Ejecución de Pruebas

### Comandos Básicos

```bash
# Ejecutar todas las pruebas de Google
npm run test:google

# Ejecutar con interfaz visual
npm run test:google:headed

# Ejecutar en modo debug
npm run test:google:debug
```

### Comandos por Navegador

```bash
# Ejecutar solo en Chrome
npm run test:google:chrome

# Ejecutar solo en Firefox
npm run test:google:firefox

# Ejecutar en mobile
npm run test:google:mobile
```

### Comandos Avanzados

```bash
# Ejecutar pruebas específicas
npx playwright test --config=playwright.config.google.ts --grep "Búsqueda principal"

# Ejecutar con reportes detallados
npx playwright test --config=playwright.config.google.ts --reporter=html

# Ejecutar un solo archivo
npx playwright test --config=playwright.config.google.ts google-search.spec.ts
```

## 📊 Casos de Prueba Incluidos

### Pruebas Básicas (`google-search.spec.ts`)
1. **Búsqueda básica**: "analista de datos"
2. **Verificación de títulos**: Términos relevantes
3. **Validación de enlaces**: URLs válidas
4. **Términos específicos**: Empleos, requisitos, sueldo
5. **Interacción con resultados**: Clic en primer resultado
6. **Sugerencias**: Autocompletado
7. **Filtros geográficos**: Búsqueda para México
8. **Comparación idiomas**: Español vs Inglés
9. **Operadores avanzados**: Búsqueda exacta con comillas
10. **Tiempo de respuesta**: Medición de rendimiento

### Pruebas Avanzadas (`google-search-advanced.spec.ts`)
1. **Data-Driven**: Usando archivo JSON
2. **Variaciones de términos**: Múltiples búsquedas
3. **Habilidades técnicas**: Python, SQL, Excel
4. **Portales de empleo**: Indeed, LinkedIn, OCC
5. **Educación**: Cursos, certificaciones
6. **Métricas de rendimiento**: Análisis estadístico
7. **Caracteres especiales**: Búsquedas complejas
8. **Términos numéricos**: Salarios, experiencia

## 📈 Datos de Prueba

El archivo `google-search-data.json` incluye:

```json
{
  "searchTerms": {
    "primary": "analista de datos",
    "variations": [...],
    "exact": [...],
    "english": [...]
  },
  "expectedKeywords": [...],
  "locations": {...},
  "skills": [...],
  "companies": [...],
  "education": [...]
}
```

## 🎯 Validaciones Implementadas

- ✅ Presencia de resultados de búsqueda
- ✅ Términos relevantes en títulos
- ✅ Validez de URLs
- ✅ Tiempo de respuesta < 10 segundos
- ✅ Palabras clave esperadas (30% mínimo)
- ✅ Geolocalización efectiva
- ✅ Funcionalidad de autocompletado
- ✅ Navegación exitosa a resultados

## 📱 Configuración Multi-Navegador

### Chrome
- Configuración anti-bot
- Argumentos específicos para automatización
- User-Agent realista

### Firefox
- Preferencias de usuario personalizadas
- Configuración de medios
- Geolocalización habilitada

### Mobile
- Viewport de dispositivo móvil
- User-Agent específico de iPhone
- Pruebas responsive

## 🔍 Configuración Anti-Bot

Para evitar detección como bot:

```typescript
// Headers realistas
extraHTTPHeaders: {
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'DNT': '1',
  'Connection': 'keep-alive'
}

// Argumentos de Chrome
args: [
  '--disable-blink-features=AutomationControlled',
  '--disable-dev-shm-usage',
  '--no-sandbox'
]
```

## 📊 Reportes y Artefactos

### Ubicación de Resultados
- **HTML Report**: `test-results/google-search-report/`
- **JSON Results**: `test-results/google-search-results.json`
- **Screenshots**: `test-results/google-artifacts/`
- **Videos**: `test-results/google-artifacts/`

### Ver Reportes
```bash
# Abrir reporte HTML
npx playwright show-report test-results/google-search-report

# Ver resultados en JSON
cat test-results/google-search-results.json
```

## 🛠️ Solución de Problemas

### Error: "Page not found"
```bash
# Verificar conectividad
ping google.com

# Verificar proxy/firewall
curl -I https://google.com
```

### Error: "Timeout"
```bash
# Aumentar timeout en configuración
timeout: 60000

# Verificar velocidad de internet
speedtest-cli
```

### Error: "Bot detected"
```bash
# Cambiar User-Agent
userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

# Agregar pausas entre pruebas
await page.waitForTimeout(2000);
```

## 🎯 Mejores Prácticas

1. **Respetar rate limits**: Pausas entre búsquedas
2. **Usar configuración específica**: `playwright.config.google.ts`
3. **Monitorear métricas**: Tiempo de respuesta y éxito
4. **Actualizar selectores**: Cambios en UI de Google
5. **Manejar errores**: Capturas y logs detallados

## 📋 Checklist de Ejecución

Antes de ejecutar las pruebas:

- [ ] Conexión a internet estable
- [ ] Navegadores instalados
- [ ] Configuración de proxy (si aplica)
- [ ] Datos de prueba actualizados
- [ ] Espacio en disco para artefactos

## 📚 Recursos Adicionales

- [Documentación de Playwright](https://playwright.dev/)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Configuración Anti-Bot](https://playwright.dev/docs/browsers)
- [Selectores CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)

## 🤝 Contribución

Para agregar nuevas pruebas:

1. Editar `google-search-data.json` con nuevos términos
2. Agregar casos en `google-search-advanced.spec.ts`
3. Actualizar selectores en `GooglePage.ts`
4. Documentar cambios en este README

## 🎉 Ejemplo de Ejecución

```bash
# Ejecutar pruebas completas
npm run test:google

# Salida esperada:
Running 15 tests using 2 workers
✓ Búsqueda principal - Analista de Datos (5.2s)
✓ Búsquedas con variaciones de términos (12.1s)
✓ Búsquedas en inglés vs español (8.9s)
✓ Búsqueda con geolocalización - México (6.7s)
✓ Análisis de rendimiento y métricas (15.3s)

15 passed (48.2s)
```

¡Listo para automatizar búsquedas en Google! 🚀
