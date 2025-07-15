# 🚀 Guía Rápida - Automatización Roadmap.sh

## Escenario de Prueba
1. ✅ Abrir https://roadmap.sh/
2. ✅ Hacer clic en "Data Analyst"  
3. ✅ Validar el título "Data Analyst Roadmap"

## 📁 Archivos Creados

### Page Object Model
- `tests/pages/RoadmapPage.ts` - Lógica de interacción con la página

### Pruebas
- `tests/specs/roadmap.spec.ts` - Casos de prueba completos

### Datos
- `tests/data/roadmap-data.json` - Configuración y datos de prueba

### Configuración
- Scripts agregados a `package.json`
- Variables de entorno en `.env.example`
- Archivo de ejecución `run-roadmap-tests.bat`

## 🎯 Comandos Rápidos

### Windows (Recomendado)
```powershell
# Ejecutar pruebas con interfaz gráfica
npm run test:roadmap:headed

# Ejecutar en modo debug
npm run test:roadmap:debug

# Ejecutar solo en Chrome
npm run test:roadmap:chrome

# Ejecutar con script automático
.\run-roadmap-tests.bat
```

### Comandos Alternativos Windows
```powershell
# Scripts directos sin variables de entorno
npm run test:roadmap:win
npm run test:roadmap:win:debug
npm run test:roadmap:win:chrome

# Comando directo
npx playwright test roadmap.spec.ts --headed
```

## 📊 Reportes

Los reportes se generan en:
- `test-results/html-report/` - Reporte HTML
- `test-results/screenshots/` - Capturas de pantalla
- `test-results/videos/` - Videos de ejecución

## 🔧 Personalización

Puedes modificar:
- **Selectores**: En `RoadmapPage.ts`
- **Datos**: En `roadmap-data.json`
- **Configuración**: En `.env`
- **Timeouts**: En `playwright.config.ts`

## ✅ Validaciones Incluidas

- [x] Navegación a la página principal
- [x] Clic en enlace "Data Analyst"
- [x] Validación de URL correcta
- [x] Validación de título "Data Analyst Roadmap"
- [x] Verificación de elementos de la página
- [x] Manejo de errores y selectores alternativos
- [x] Screenshots automáticos
- [x] Logs detallados

¡Listo para usar! 🎉
