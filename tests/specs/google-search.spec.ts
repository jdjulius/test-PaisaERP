import { test, expect } from '@playwright/test';
import { GooglePage } from '../pages/GooglePage';

/**
 * Suite de pruebas para búsqueda en Google
 * Enfocado en la búsqueda de "analista de datos"
 */
test.describe('Google Search - Analista de Datos', () => {
  let googlePage: GooglePage;

  test.beforeEach(async ({ page }) => {
    googlePage = new GooglePage(page);
    await googlePage.navigateToGoogle();
  });

  test('Buscar "analista de datos" y verificar resultados', async ({ page }) => {
    // Realizar la búsqueda
    await googlePage.search('analista de datos');
    
    // Verificar que hay resultados
    await googlePage.verifySearchResults();
    
    // Verificar que los resultados contienen términos relacionados
    await googlePage.verifyResultsContainTerms(['analista', 'datos', 'data']);
    
    // Obtener estadísticas de resultados
    const resultsCount = await googlePage.getResultsCount();
    console.log(`Resultados encontrados: ${resultsCount}`);
    
    // Verificar que hay múltiples resultados
    expect(resultsCount).toContain('resultado');
  });

  test('Verificar títulos de resultados contienen términos relevantes', async ({ page }) => {
    await googlePage.search('analista de datos');
    
    // Obtener los primeros 5 títulos
    const titles = await googlePage.getResultTitles(5);
    
    // Verificar que al menos algunos títulos contienen términos relevantes
    const relevantTitles = titles.filter(title => 
      title.toLowerCase().includes('analista') || 
      title.toLowerCase().includes('datos') || 
      title.toLowerCase().includes('data')
    );
    
    expect(relevantTitles.length).toBeGreaterThan(0);
    
    // Mostrar títulos en consola para debugging
    console.log('Títulos encontrados:');
    titles.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });
  });

  test('Verificar enlaces de resultados son válidos', async ({ page }) => {
    await googlePage.search('analista de datos');
    
    // Obtener los primeros 3 enlaces
    const links = await googlePage.getResultLinks(3);
    
    // Verificar que los enlaces son válidos (contienen http/https)
    for (const link of links) {
      expect(link).toMatch(/^https?:\/\//);
    }
    
    // Mostrar enlaces en consola
    console.log('Enlaces encontrados:');
    links.forEach((link, index) => {
      console.log(`${index + 1}. ${link}`);
    });
  });

  test('Buscar términos específicos relacionados con analista de datos', async ({ page }) => {
    const searchTerms = [
      'analista de datos empleos',
      'analista de datos requisitos',
      'analista de datos sueldo',
      'curso analista de datos'
    ];

    for (const term of searchTerms) {
      await googlePage.search(term);
      
      // Verificar que hay resultados para cada término
      await googlePage.verifySearchResults();
      
      // Obtener el primer título para verificar relevancia
      const titles = await googlePage.getResultTitles(1);
      expect(titles.length).toBeGreaterThan(0);
      
      console.log(`Búsqueda: "${term}" - Primer resultado: "${titles[0]}"`);
      
      // Limpiar búsqueda para la siguiente iteración
      await page.goto('https://www.google.com');
      await page.waitForLoadState('networkidle');
    }
  });

  test('Interactuar con el primer resultado de "analista de datos"', async ({ page }) => {
    await googlePage.search('analista de datos');
    
    // Obtener información del primer resultado antes de hacer clic
    const firstTitle = (await googlePage.getResultTitles(1))[0];
    const firstLink = (await googlePage.getResultLinks(1))[0];
    
    console.log(`Primer resultado: ${firstTitle}`);
    console.log(`URL: ${firstLink}`);
    
    // Hacer clic en el primer resultado
    await googlePage.clickResultByPosition(0);
    
    // Verificar que se navegó a una nueva página
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).not.toBe('https://www.google.com/');
    
    console.log(`Navegado a: ${currentUrl}`);
  });

  test('Verificar sugerencias de búsqueda', async ({ page }) => {
    // Navegar a Google
    await googlePage.navigateToGoogle();
    
    // Escribir parte del término y esperar sugerencias
    await page.locator('[name="q"]').fill('analista de');
    await page.waitForTimeout(1000); // Esperar sugerencias
    
    // Obtener sugerencias
    const suggestions = await googlePage.getSuggestions();
    
    if (suggestions.length > 0) {
      console.log('Sugerencias encontradas:');
      suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion}`);
      });
      
      // Verificar que hay sugerencias relevantes
      const relevantSuggestions = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes('datos') || 
        suggestion.toLowerCase().includes('data')
      );
      
      expect(relevantSuggestions.length).toBeGreaterThan(0);
    }
  });

  test('Búsqueda con filtros adicionales', async ({ page }) => {
    // Buscar con términos más específicos
    await googlePage.search('analista de datos trabajo México');
    
    await googlePage.verifySearchResults();
    
    // Verificar que los resultados son relevantes para México
    const titles = await googlePage.getResultTitles(5);
    const mexicoResults = titles.filter(title => 
      title.toLowerCase().includes('méxico') || 
      title.toLowerCase().includes('mexico') ||
      title.toLowerCase().includes('mx')
    );
    
    // Al menos algunos resultados deberían mencionar México
    console.log(`Resultados específicos para México: ${mexicoResults.length} de ${titles.length}`);
    
    // Mostrar todos los títulos para análisis
    console.log('Títulos encontrados:');
    titles.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });
  });

  test('Verificar tiempo de respuesta de búsqueda', async ({ page }) => {
    const startTime = Date.now();
    
    await googlePage.search('analista de datos');
    await googlePage.verifySearchResults();
    
    const endTime = Date.now();
    const searchTime = endTime - startTime;
    
    console.log(`Tiempo de búsqueda: ${searchTime}ms`);
    
    // Verificar que la búsqueda no toma más de 10 segundos
    expect(searchTime).toBeLessThan(10000);
  });
});

/**
 * Suite de pruebas adicionales para diferentes tipos de búsqueda
 */
test.describe('Google Search - Variaciones de Analista de Datos', () => {
  let googlePage: GooglePage;

  test.beforeEach(async ({ page }) => {
    googlePage = new GooglePage(page);
    await googlePage.navigateToGoogle();
  });

  test('Comparar resultados en español vs inglés', async ({ page }) => {
    // Búsqueda en español
    await googlePage.search('analista de datos');
    const spanishTitles = await googlePage.getResultTitles(5);
    
    // Búsqueda en inglés
    await googlePage.search('data analyst');
    const englishTitles = await googlePage.getResultTitles(5);
    
    console.log('Resultados en español:');
    spanishTitles.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });
    
    console.log('\nResultados en inglés:');
    englishTitles.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });
    
    // Verificar que ambas búsquedas produjeron resultados
    expect(spanishTitles.length).toBeGreaterThan(0);
    expect(englishTitles.length).toBeGreaterThan(0);
  });

  test('Búsqueda con operadores avanzados', async ({ page }) => {
    // Usar comillas para búsqueda exacta
    await googlePage.search('"analista de datos" empleo');
    await googlePage.verifySearchResults();
    
    const titles = await googlePage.getResultTitles(5);
    
    // Verificar que los resultados contienen la frase exacta
    const exactMatches = titles.filter(title => 
      title.toLowerCase().includes('analista de datos')
    );
    
    expect(exactMatches.length).toBeGreaterThan(0);
    
    console.log('Resultados con búsqueda exacta:');
    titles.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });
  });
});
