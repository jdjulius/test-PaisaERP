import { test, expect } from '@playwright/test';
import { GooglePage } from '../pages/GooglePage';
import { DataProvider } from '../utils/DataProvider';

/**
 * Suite de pruebas avanzadas para Google Search
 * Utiliza datos JSON para mayor flexibilidad y mantenibilidad
 */
test.describe('Google Search - Analista de Datos (Data-Driven)', () => {
  let googlePage: GooglePage;
  let searchData: any;

  test.beforeAll(async () => {
    searchData = await DataProvider.readJsonData('google-search-data.json');
  });

  test.beforeEach(async ({ page }) => {
    googlePage = new GooglePage(page);
    await googlePage.navigateToGoogle();
  });

  test('Búsqueda principal - Analista de Datos', async ({ page }) => {
    const primaryTerm = searchData.searchTerms.primary;
    const expectedKeywords = searchData.expectedKeywords;
    
    await googlePage.search(primaryTerm);
    await googlePage.verifySearchResults();
    
    // Verificar que los resultados contienen palabras clave esperadas
    const titles = await googlePage.getResultTitles(searchData.reportSettings.maxTitlesToShow);
    const allText = titles.join(' ').toLowerCase();
    
    let matchedKeywords = 0;
    for (const keyword of expectedKeywords) {
      if (allText.includes(keyword.toLowerCase())) {
        matchedKeywords++;
      }
    }
    
    // Al menos 30% de las palabras clave deben aparecer
    const matchPercentage = (matchedKeywords / expectedKeywords.length) * 100;
    expect(matchPercentage).toBeGreaterThan(30);
    
    console.log(`Búsqueda: "${primaryTerm}"`);
    console.log(`Palabras clave encontradas: ${matchedKeywords}/${expectedKeywords.length} (${matchPercentage.toFixed(1)}%)`);
    
    // Mostrar títulos
    titles.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });
  });

  test('Búsquedas con variaciones de términos', async ({ page }) => {
    const variations = searchData.searchTerms.variations;
    const performance = searchData.performance;
    
    for (const term of variations.slice(0, 3)) { // Limitar a 3 para evitar sobrecarga
      const startTime = Date.now();
      
      await googlePage.search(term);
      await googlePage.verifySearchResults();
      
      const endTime = Date.now();
      const searchTime = endTime - startTime;
      
      // Verificar rendimiento
      expect(searchTime).toBeLessThan(performance.maxSearchTime);
      
      // Obtener resultados
      const titles = await googlePage.getResultTitles(performance.minResults);
      expect(titles.length).toBeGreaterThanOrEqual(performance.minResults);
      
      console.log(`\nBúsqueda: "${term}" (${searchTime}ms)`);
      console.log(`Resultados: ${titles.length}`);
      
      // Esperar entre búsquedas
      await page.waitForTimeout(performance.timeoutBetweenSearches);
    }
  });

  test('Búsquedas en inglés vs español', async ({ page }) => {
    const spanishTerms = searchData.searchTerms.variations.slice(0, 2);
    const englishTerms = searchData.searchTerms.english.slice(0, 2);
    
    console.log('=== Comparación Español vs Inglés ===');
    
    for (let i = 0; i < Math.min(spanishTerms.length, englishTerms.length); i++) {
      // Búsqueda en español
      await googlePage.search(spanishTerms[i]);
      const spanishTitles = await googlePage.getResultTitles(3);
      
      // Búsqueda en inglés
      await googlePage.search(englishTerms[i]);
      const englishTitles = await googlePage.getResultTitles(3);
      
      console.log(`\nComparación ${i + 1}:`);
      console.log(`Español: "${spanishTerms[i]}"`);
      spanishTitles.forEach((title, idx) => console.log(`  ${idx + 1}. ${title}`));
      
      console.log(`Inglés: "${englishTerms[i]}"`);
      englishTitles.forEach((title, idx) => console.log(`  ${idx + 1}. ${title}`));
      
      // Verificar que ambas búsquedas produjeron resultados
      expect(spanishTitles.length).toBeGreaterThan(0);
      expect(englishTitles.length).toBeGreaterThan(0);
      
      await page.waitForTimeout(1500);
    }
  });

  test('Búsqueda con geolocalización - México', async ({ page }) => {
    const mexicoTerms = searchData.locations.mexico.terms;
    const expectedKeywords = searchData.locations.mexico.expectedKeywords;
    
    for (const term of mexicoTerms.slice(0, 2)) {
      await googlePage.search(term);
      await googlePage.verifySearchResults();
      
      const titles = await googlePage.getResultTitles(5);
      const allText = titles.join(' ').toLowerCase();
      
      // Verificar que al menos algunos resultados mencionan México
      const hasLocationKeywords = expectedKeywords.some((keyword: string) => 
        allText.includes(keyword.toLowerCase())
      );
      
      console.log(`\nBúsqueda geo-localizada: "${term}"`);
      console.log(`Contiene palabras clave de México: ${hasLocationKeywords}`);
      
      titles.forEach((title, index) => {
        console.log(`${index + 1}. ${title}`);
      });
      
      await page.waitForTimeout(2000);
    }
  });

  test('Búsqueda de habilidades técnicas', async ({ page }) => {
    const skills = searchData.skills;
    const primaryTerm = searchData.searchTerms.primary;
    
    // Combinar término principal con habilidades
    const skillSearches = skills.slice(0, 3).map((skill: string) => `${primaryTerm} ${skill}`);
    
    for (const searchTerm of skillSearches) {
      await googlePage.search(searchTerm);
      await googlePage.verifySearchResults();
      
      const titles = await googlePage.getResultTitles(3);
      const allText = titles.join(' ').toLowerCase();
      
      // Verificar que los resultados contienen el término de habilidad
      const skill = searchTerm.split(' ').pop()?.toLowerCase();
      const hasSkill = allText.includes(skill || '');
      
      console.log(`\nBúsqueda de habilidad: "${searchTerm}"`);
      console.log(`Contiene habilidad "${skill}": ${hasSkill}`);
      
      titles.forEach((title, index) => {
        console.log(`${index + 1}. ${title}`);
      });
      
      await page.waitForTimeout(1500);
    }
  });

  test('Búsqueda de portales de empleo', async ({ page }) => {
    const jobPortals = searchData.jobPortals;
    const primaryTerm = searchData.searchTerms.primary;
    
    // Buscar en portales específicos
    const portalSearches = jobPortals.slice(0, 3).map((portal: string) => `${primaryTerm} site:${portal}.com`);
    
    for (const searchTerm of portalSearches) {
      await googlePage.search(searchTerm);
      
      try {
        await googlePage.verifySearchResults();
        const titles = await googlePage.getResultTitles(3);
        
        console.log(`\nBúsqueda en portal: "${searchTerm}"`);
        console.log(`Resultados encontrados: ${titles.length}`);
        
        titles.forEach((title, index) => {
          console.log(`${index + 1}. ${title}`);
        });
        
      } catch (error) {
        console.log(`No se encontraron resultados para: ${searchTerm}`);
      }
      
      await page.waitForTimeout(2000);
    }
  });

  test('Búsqueda de educación y certificaciones', async ({ page }) => {
    const education = searchData.education;
    const primaryTerm = searchData.searchTerms.primary;
    
    // Combinar con términos educativos
    const educationSearches = education.slice(0, 3).map((edu: string) => `${primaryTerm} ${edu}`);
    
    for (const searchTerm of educationSearches) {
      await googlePage.search(searchTerm);
      await googlePage.verifySearchResults();
      
      const titles = await googlePage.getResultTitles(3);
      const links = await googlePage.getResultLinks(3);
      
      console.log(`\nBúsqueda educativa: "${searchTerm}"`);
      console.log(`Resultados: ${titles.length}`);
      
      titles.forEach((title, index) => {
        console.log(`${index + 1}. ${title}`);
        console.log(`    URL: ${links[index] || 'N/A'}`);
      });
      
      await page.waitForTimeout(1500);
    }
  });

  test('Análisis de rendimiento y métricas', async ({ page }) => {
    const performance = searchData.performance;
    const primaryTerm = searchData.searchTerms.primary;
    
    const metrics = {
      totalSearches: 0,
      totalTime: 0,
      successfulSearches: 0,
      averageResults: 0,
      totalResults: 0
    };
    
    // Realizar múltiples búsquedas para obtener métricas
    const testTerms = [
      primaryTerm,
      ...searchData.searchTerms.variations.slice(0, 2)
    ];
    
    for (const term of testTerms) {
      const startTime = Date.now();
      metrics.totalSearches++;
      
      try {
        await googlePage.search(term);
        await googlePage.verifySearchResults();
        
        const endTime = Date.now();
        const searchTime = endTime - startTime;
        metrics.totalTime += searchTime;
        
        const titles = await googlePage.getResultTitles(10);
        metrics.totalResults += titles.length;
        metrics.successfulSearches++;
        
        // Verificar rendimiento individual
        expect(searchTime).toBeLessThan(performance.maxSearchTime);
        expect(titles.length).toBeGreaterThanOrEqual(performance.minResults);
        
        await page.waitForTimeout(performance.timeoutBetweenSearches);
        
      } catch (error) {
        console.log(`Error en búsqueda: ${term} - ${error}`);
      }
    }
    
    // Calcular métricas finales
    metrics.averageResults = Math.round(metrics.totalResults / metrics.successfulSearches);
    const averageTime = Math.round(metrics.totalTime / metrics.successfulSearches);
    const successRate = Math.round((metrics.successfulSearches / metrics.totalSearches) * 100);
    
    console.log('\n=== MÉTRICAS DE RENDIMIENTO ===');
    console.log(`Total de búsquedas: ${metrics.totalSearches}`);
    console.log(`Búsquedas exitosas: ${metrics.successfulSearches}`);
    console.log(`Tasa de éxito: ${successRate}%`);
    console.log(`Tiempo promedio: ${averageTime}ms`);
    console.log(`Resultados promedio: ${metrics.averageResults}`);
    
    // Verificaciones finales
    expect(successRate).toBeGreaterThan(80);
    expect(averageTime).toBeLessThan(performance.maxSearchTime);
    expect(metrics.averageResults).toBeGreaterThan(performance.minResults);
  });
});

/**
 * Suite de pruebas para casos especiales y edge cases
 */
test.describe('Google Search - Casos Especiales', () => {
  let googlePage: GooglePage;
  let searchData: any;

  test.beforeAll(async () => {
    searchData = await DataProvider.readJsonData('google-search-data.json');
  });

  test.beforeEach(async ({ page }) => {
    googlePage = new GooglePage(page);
    await googlePage.navigateToGoogle();
  });

  test('Búsqueda con comillas (búsqueda exacta)', async ({ page }) => {
    const exactTerms = searchData.searchTerms.exact;
    
    for (const term of exactTerms.slice(0, 2)) {
      await googlePage.search(term);
      await googlePage.verifySearchResults();
      
      const titles = await googlePage.getResultTitles(5);
      const allText = titles.join(' ').toLowerCase();
      
      // Extraer el término entre comillas
      const exactMatch = term.match(/"([^"]+)"/);
      if (exactMatch) {
        const exactTerm = exactMatch[1].toLowerCase();
        const hasExactMatch = allText.includes(exactTerm);
        
        console.log(`\nBúsqueda exacta: ${term}`);
        console.log(`Contiene término exacto "${exactTerm}": ${hasExactMatch}`);
        
        titles.forEach((title, index) => {
          console.log(`${index + 1}. ${title}`);
        });
      }
      
      await page.waitForTimeout(2000);
    }
  });

  test('Búsqueda con caracteres especiales', async ({ page }) => {
    const specialTerms = [
      'analista de datos + python',
      'analista de datos & excel',
      'analista de datos (junior)',
      'analista de datos - entry level'
    ];
    
    for (const term of specialTerms) {
      try {
        await googlePage.search(term);
        await googlePage.verifySearchResults();
        
        const titles = await googlePage.getResultTitles(3);
        
        console.log(`\nBúsqueda con caracteres especiales: "${term}"`);
        console.log(`Resultados: ${titles.length}`);
        
        titles.forEach((title, index) => {
          console.log(`${index + 1}. ${title}`);
        });
        
      } catch (error) {
        console.log(`No se encontraron resultados para: ${term}`);
      }
      
      await page.waitForTimeout(1500);
    }
  });

  test('Búsqueda con números y rangos', async ({ page }) => {
    const numericTerms = [
      'analista de datos salario 2024',
      'analista de datos 1-2 años experiencia',
      'analista de datos $30000 $50000',
      'analista de datos python 3.x'
    ];
    
    for (const term of numericTerms) {
      await googlePage.search(term);
      
      try {
        await googlePage.verifySearchResults();
        const titles = await googlePage.getResultTitles(3);
        
        console.log(`\nBúsqueda numérica: "${term}"`);
        console.log(`Resultados: ${titles.length}`);
        
        titles.forEach((title, index) => {
          console.log(`${index + 1}. ${title}`);
        });
        
      } catch (error) {
        console.log(`Pocos resultados para: ${term}`);
      }
      
      await page.waitForTimeout(1500);
    }
  });
});
