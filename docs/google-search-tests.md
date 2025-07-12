# Pruebas de Google Search - Analista de Datos

## Descripción

Este conjunto de pruebas automatizadas está diseñado para validar la funcionalidad de búsqueda en Google, específicamente enfocado en la búsqueda de "analista de datos" y términos relacionados.

## Objetivo

Demostrar capacidades de automatización web para:
- Búsquedas en sitios externos (Google)
- Validación de resultados de búsqueda
- Interacción con elementos dinámicos
- Manejo de cookies y políticas de privacidad
- Pruebas en múltiples navegadores

## Estructura de Archivos

```
tests/
├── pages/
│   ├── BasePage.ts           # Clase base para POM
│   └── GooglePage.ts         # Page Object para Google
├── specs/
│   └── google-search.spec.ts # Pruebas de búsqueda
└── ...
```

## Configuración Específica

### playwright.config.google.ts
Configuración optimizada para pruebas externas:
- Timeouts extendidos para sitios externos
- User-Agent realista
- Headers específicos para evitar detección de bots
- Configuración de geolocalización para México
- Múltiples proyectos (Chrome, Firefox, Mobile)

## Casos de Prueba

### 1. Búsqueda Básica
- **Descripción**: Realizar búsqueda de "analista de datos"
- **Validaciones**:
  - Presencia de resultados
  - Términos relevantes en títulos
  - Conteo de resultados

### 2. Verificación de Títulos
- **Descripción**: Validar que los títulos contienen términos relevantes
- **Validaciones**:
  - Análisis de los primeros 5 resultados
  - Presencia de palabras clave: "analista", "datos", "data"

### 3. Validación de Enlaces
- **Descripción**: Verificar que los enlaces son válidos
- **Validaciones**:
  - Formato de URL correcto (http/https)
  - Enlaces accesibles

### 4. Búsquedas Específicas
- **Descripción**: Probar variaciones de búsqueda
- **Términos**:
  - "analista de datos empleos"
  - "analista de datos requisitos"
  - "analista de datos sueldo"
  - "curso analista de datos"

### 5. Interacción con Resultados
- **Descripción**: Hacer clic en resultados
- **Validaciones**:
  - Navegación exitosa
  - Cambio de URL
  - Carga de página destino

### 6. Sugerencias de Búsqueda
- **Descripción**: Verificar autocompletado
- **Validaciones**:
  - Presencia de sugerencias
  - Relevancia de sugerencias

### 7. Búsqueda con Filtros
- **Descripción**: Búsqueda geo-localizada
- **Ejemplo**: "analista de datos trabajo México"
- **Validaciones**:
  - Resultados específicos por ubicación

### 8. Comparación de Idiomas
- **Descripción**: Comparar resultados en español vs inglés
- **Términos**:
  - "analista de datos" vs "data analyst"

### 9. Operadores Avanzados
- **Descripción**: Uso de comillas para búsqueda exacta
- **Ejemplo**: "analista de datos" empleo

### 10. Rendimiento
- **Descripción**: Medir tiempo de respuesta
- **Validaciones**:
  - Tiempo < 10 segundos

## Comandos de Ejecución

### Ejecutar todas las pruebas de Google
```bash
npm run test:google
```

### Ejecutar con interfaz visual
```bash
npm run test:google:headed
```

### Ejecutar en modo debug
```bash
npm run test:google:debug
```

### Ejecutar solo en Chrome
```bash
npm run test:google:chrome
```

### Ejecutar solo en Firefox
```bash
npm run test:google:firefox
```

### Ejecutar en mobile
```bash
npm run test:google:mobile
```

## Características Técnicas

### Page Object Model (POM)
La clase `GooglePage` implementa:
- Locators específicos para Google
- Métodos de alto nivel para interacciones
- Manejo de cookies y políticas
- Extracción de resultados y metadatos

### Manejo de Errores
- Timeouts configurables
- Reintentos automáticos
- Captura de screenshots en fallos
- Logs detallados para debugging

### Configuración Anti-Bot
- User-Agent realista
- Headers HTTP específicos
- Configuración de viewport
- Geolocalización
- Argumentos de Chrome optimizados

## Resultados y Reportes

### Ubicación de Artefactos
- **HTML Report**: `test-results/google-search-report/`
- **JSON Results**: `test-results/google-search-results.json`
- **Screenshots**: `test-results/google-artifacts/`
- **Videos**: `test-results/google-artifacts/`

### Información de Consola
Cada prueba muestra:
- Títulos de resultados encontrados
- URLs de los primeros resultados
- Tiempos de respuesta
- Conteo de resultados relevantes

## Limitaciones y Consideraciones

### Rate Limiting
- Google puede limitar requests automáticos
- Se recomienda usar workers limitados
- Pausas entre pruebas si es necesario

### Políticas de Términos
- Respetar términos de servicio de Google
- Uso únicamente para propósitos de testing
- No realizar pruebas masivas

### Estabilidad
- Los selectores pueden cambiar
- Resultados pueden variar por geolocalización
- Dependencia de conectividad a internet

## Mejores Prácticas

1. **Ejecutar en horarios de menor tráfico**
2. **Usar configuración específica para sitios externos**
3. **Implementar manejo robusto de errores**
4. **Documentar cambios en selectores**
5. **Monitorear tiempos de respuesta**

## Mantenimiento

### Actualizaciones Regulares
- Verificar selectores de Google
- Actualizar User-Agents
- Ajustar timeouts según sea necesario

### Monitoreo
- Revisar logs de errores
- Analizar tasas de éxito
- Optimizar configuraciones

## Extensiones Futuras

1. **Más motores de búsqueda**: Bing, DuckDuckGo
2. **Búsquedas específicas**: LinkedIn, Indeed
3. **Análisis de SERP**: Posiciones, anuncios
4. **Alertas automáticas**: Cambios en resultados
5. **Integración con APIs**: Google Custom Search

## Soporte

Para problemas o mejoras:
1. Revisar logs de ejecución
2. Verificar conectividad
3. Actualizar navegadores
4. Consultar documentación de Playwright
