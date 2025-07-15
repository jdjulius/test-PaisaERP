import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración unificada de Playwright para PaisaERP
 * Incluye configuraciones para desarrollo, CI/CD y pruebas externas (Google)
 * Adaptable según variables de entorno
 */
export default defineConfig({
  testDir: './tests/specs',
  
  // Timeout adaptativo según el ambiente
  timeout: process.env.TEST_TYPE === 'google' ? 45000 : 
           process.env.NODE_ENV === 'development' ? 60000 : 
           process.env.CI ? 45000 : 30000,
  
  expect: {
    timeout: process.env.TEST_TYPE === 'google' ? 8000 : 
             process.env.NODE_ENV === 'development' ? 10000 : 
             process.env.CI ? 8000 : 5000,
  },

  // Configuración adaptativa según el ambiente
  fullyParallel: process.env.NODE_ENV === 'development' ? false : true,
  forbidOnly: process.env.NODE_ENV === 'development' ? false : !!process.env.CI,
  retries: process.env.TEST_TYPE === 'google' && process.env.CI ? 3 : 
           process.env.CI ? 2 : 
           process.env.NODE_ENV === 'development' ? 0 : 0,
  workers: process.env.TEST_TYPE === 'google' && process.env.CI ? 1 : 
           process.env.TEST_TYPE === 'google' ? 2 : 
           process.env.CI ? 1 : 
           process.env.NODE_ENV === 'development' ? 1 : 4,
  
  // Reportes adaptativos
  reporter: [
    ['html', { 
      outputFolder: process.env.TEST_TYPE === 'google' ? 'test-results/google-search-report' : 'test-results/html-report',
      open: process.env.NODE_ENV === 'development' ? 'always' : 'never'
    }],
    ['json', { 
      outputFile: process.env.TEST_TYPE === 'google' ? 'test-results/google-search-results.json' : 'test-results/results.json'
    }],
    ['list'],
    ...(process.env.CI ? [
      ['junit', { outputFile: 'test-results/results.xml' }] as const,
      ['github'] as const
    ] : []),
  ],

  // Configuración global adaptativa
  use: {
    // URL base condicional
    baseURL: process.env.TEST_TYPE === 'google' ? undefined : 
             process.env.BASE_URL || 'http://localhost:3000',
    
    // Capturas según ambiente
    screenshot: 'only-on-failure',
    video: process.env.NODE_ENV === 'development' ? 'retain-on-failure' : 
           process.env.CI ? 'retain-on-failure' : 'retain-on-failure',
    trace: process.env.NODE_ENV === 'development' ? 'on-first-retry' : 
           process.env.CI ? 'retain-on-failure' : 'retain-on-failure',
    
    // Timeouts adaptativos
    actionTimeout: process.env.TEST_TYPE === 'google' ? 15000 : 
                   process.env.NODE_ENV === 'development' ? 15000 : 
                   process.env.CI ? 12000 : 10000,
    navigationTimeout: process.env.TEST_TYPE === 'google' ? 30000 : 
                       process.env.NODE_ENV === 'development' ? 30000 : 
                       process.env.CI ? 20000 : 15000,
    
    // Configuración común
    ignoreHTTPSErrors: true,
    
    // User-Agent condicional
    userAgent: process.env.TEST_TYPE === 'google' 
      ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      : 'PaisaERP-TestBot/1.0',
    
    // Headers adaptativos
    extraHTTPHeaders: {
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      ...(process.env.TEST_TYPE === 'google' ? {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      } : {
        'X-Test-Environment': process.env.NODE_ENV || 'test',
        ...(process.env.CI ? {
          'X-CI-Build': process.env.GITHUB_RUN_ID || 'unknown',
        } : {}),
      }),
    },
    
    // Viewport condicional
    viewport: process.env.TEST_TYPE === 'google' 
      ? { width: 1366, height: 768 }
      : { width: 1280, height: 720 },
    
    // Geolocalización México
    geolocation: { longitude: -99.1332, latitude: 19.4326 },
    permissions: ['geolocation'],
    
    // Configuración adicional para pruebas externas
    bypassCSP: process.env.TEST_TYPE === 'google',
    javaScriptEnabled: true,
  },

  // Proyectos unificados
  projects: [
    // Chromium principal
    {
      name: 'chromium',
      testMatch: process.env.TEST_TYPE === 'google' ? '**/google-search.spec.ts' : '**/*.spec.ts',
      ...(process.env.TEST_TYPE !== 'google' ? { testIgnore: '**/google-search.spec.ts' } : {}),
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            ...(process.env.TEST_TYPE === 'google' ? [
              '--disable-web-security',
              '--disable-features=VizDisplayCompositor',
              '--disable-blink-features=AutomationControlled',
              '--disable-extensions',
              '--no-first-run',
              '--no-default-browser-check',
              '--disable-default-apps',
              '--disable-popup-blocking',
              '--disable-translate',
              '--disable-background-timer-throttling',
              '--disable-backgrounding-occluded-windows',
              '--disable-renderer-backgrounding',
              '--disable-field-trial-config',
              '--disable-back-forward-cache',
              '--disable-ipc-flooding-protection',
            ] : []),
            ...(process.env.CI ? [
              '--disable-gpu',
              '--disable-background-timer-throttling',
              '--disable-backgrounding-occluded-windows',
              '--disable-renderer-backgrounding',
            ] : []),
          ],
          headless: process.env.NODE_ENV === 'development' ? false : true,
          slowMo: process.env.NODE_ENV === 'development' ? 100 : 0,
        },
      },
    },
    // Firefox (no en desarrollo)
    ...(process.env.NODE_ENV !== 'development' ? [{
      name: 'firefox',
      testMatch: process.env.TEST_TYPE === 'google' ? '**/google-search.spec.ts' : '**/*.spec.ts',
      ...(process.env.TEST_TYPE !== 'google' ? { testIgnore: '**/google-search.spec.ts' } : {}),
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            'media.navigator.streams.fake': true,
            'media.navigator.permission.disabled': true,
            ...(process.env.TEST_TYPE === 'google' ? {
              'geo.enabled': true,
              'geo.provider.use_corelocation': false,
              'geo.provider.use_gpsd': false,
              'geo.provider.use_geoclue': false,
              'dom.webnotifications.enabled': false,
            } : {}),
            ...(process.env.CI ? {
              'permissions.default.microphone': 1,
              'permissions.default.camera': 1,
            } : {}),
          },
        },
      },
    }] : []),
    // WebKit (solo en CI completo, no Google)
    ...(process.env.FULL_CI && process.env.TEST_TYPE !== 'google' ? [{
      name: 'webkit',
      testIgnore: '**/google-search.spec.ts',
      use: { 
        ...devices['Desktop Safari'],
      },
    }] : []),
    // Mobile (solo para CI completo o Google)
    ...(process.env.FULL_CI || process.env.TEST_TYPE === 'google' ? [{
      name: 'mobile',
      testMatch: process.env.TEST_TYPE === 'google' ? '**/google-search.spec.ts' : '**/*.spec.ts',
      ...(process.env.TEST_TYPE !== 'google' ? { testIgnore: '**/google-search.spec.ts' } : {}),
      use: { 
        ...(process.env.TEST_TYPE === 'google' ? devices['iPhone 13'] : devices['Pixel 5']),
        ...(process.env.TEST_TYPE === 'google' ? {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        } : {}),
        ...(process.env.CI && process.env.TEST_TYPE !== 'google' ? {
          launchOptions: {
            args: [
              '--no-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
            ],
          },
        } : {}),
      },
    }] : []),
    // Proyecto para tests de API (solo para ERP)
    ...(process.env.TEST_TYPE !== 'google' ? [{
      name: 'api-tests',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
      },
    }] : []),
  ],

  // WebServer condicional
  ...(process.env.TEST_TYPE !== 'google' && !process.env.CI ? {
    webServer: {
      command: 'npm run start',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 120000,
    }
  } : {}),

  // Directorio de salida adaptativo
  outputDir: process.env.TEST_TYPE === 'google' 
    ? 'test-results/google-artifacts'
    : 'test-results/artifacts',
  
  // Metadatos adaptativos
  metadata: {
    version: process.env.npm_package_version || '1.0.0',
    project: process.env.TEST_TYPE === 'google' ? 'Google Search Tests' : 'PaisaERP',
    environment: process.env.NODE_ENV || 'test',
    ...(process.env.TEST_TYPE === 'google' ? {
      target: 'google.com',
    } : {}),
    ...(process.env.CI ? {
      branch: process.env.GITHUB_REF_NAME || 'unknown',
      commit: process.env.GITHUB_SHA || 'unknown',
    } : {}),
  },
});
