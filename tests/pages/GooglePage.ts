import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model para Google Search
 * Maneja las interacciones con la página de búsqueda de Google
 */
export class GooglePage extends BasePage {
  // Locators
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchResults: Locator;
  private readonly resultTitles: Locator;
  private readonly resultLinks: Locator;
  private readonly cookieAcceptButton: Locator;
  private readonly suggestionsDropdown: Locator;

  constructor(page: Page) {
    super(page);
    
    // Definir locators con mayor especificidad
    this.searchInput = page.locator('textarea[name="q"]').first();
    this.searchButton = page.locator('[name="btnK"]').first();
    this.searchResults = page.locator('#search');
    this.resultTitles = page.locator('#search h3');
    this.resultLinks = page.locator('#search a[href*="http"]');
    this.cookieAcceptButton = page.locator('#L2AGLb, button:has-text("Aceptar todo"), button:has-text("Accept all")');
    this.suggestionsDropdown = page.locator('[role="listbox"]');
  }

  /**
   * Navegar a Google
   */
  async navigateToGoogle(): Promise<void> {
    await this.page.goto('https://www.google.com');
    await this.page.waitForLoadState('networkidle');
    
    // Aceptar cookies si aparece el banner
    try {
      await this.cookieAcceptButton.click({ timeout: 5000 });
    } catch (error) {
      // Ignorar si no aparece el banner de cookies
      console.log('No se encontró banner de cookies o ya fue aceptado');
    }
  }

  /**
   * Realizar una búsqueda
   * @param searchTerm - Término de búsqueda
   */
  async search(searchTerm: string): Promise<void> {
    await this.searchInput.clear();
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
    
    // Esperar que aparezcan los resultados
    await this.searchResults.waitFor({ timeout: 10000 });
  }

  /**
   * Realizar una nueva búsqueda desde la página principal
   * @param searchTerm - Término de búsqueda
   */
  async newSearch(searchTerm: string): Promise<void> {
    await this.page.goto('https://www.google.com');
    await this.page.waitForLoadState('networkidle');
    
    // Aceptar cookies si aparece el banner
    try {
      await this.cookieAcceptButton.click({ timeout: 3000 });
    } catch (error) {
      // Ignorar si no aparece
    }
    
    await this.search(searchTerm);
  }

  /**
   * Obtener el número de resultados aproximado
   */
  async getResultsCount(): Promise<string> {
    try {
      const resultsStats = this.page.locator('#result-stats, .LHJvCe');
      await resultsStats.waitFor({ timeout: 5000 });
      return await resultsStats.textContent() || '0';
    } catch (error) {
      console.log('No se pudo obtener el conteo de resultados');
      return '0';
    }
  }

  /**
   * Obtener los títulos de los primeros N resultados
   * @param count - Número de resultados a obtener
   */
  async getResultTitles(count: number = 10): Promise<string[]> {
    await this.resultTitles.first().waitFor({ timeout: 10000 });
    const titles = await this.resultTitles.allTextContents();
    return titles.slice(0, count);
  }

  /**
   * Obtener los enlaces de los primeros N resultados
   * @param count - Número de resultados a obtener
   */
  async getResultLinks(count: number = 10): Promise<string[]> {
    await this.resultLinks.first().waitFor({ timeout: 10000 });
    const links = await this.resultLinks.evaluateAll((elements) => 
      elements.map(el => el.getAttribute('href'))
        .filter(href => href !== null && href.startsWith('http'))
        .map(href => href as string)
    );
    return links.slice(0, count);
  }

  /**
   * Verificar que existen resultados de búsqueda
   */
  async verifySearchResults(): Promise<void> {
    await expect(this.searchResults).toBeVisible();
    
    // Esperar que aparezcan los títulos (manejo más robusto)
    try {
      await this.resultTitles.first().waitFor({ state: 'visible', timeout: 10000 });
    } catch (error) {
      console.log('Títulos no visibles, verificando presencia en DOM');
      await expect(this.resultTitles.first()).toBeAttached();
    }
  }

  /**
   * Verificar que los resultados contienen términos específicos
   * @param terms - Términos que deben aparecer en los resultados
   */
  async verifyResultsContainTerms(terms: string[]): Promise<void> {
    const titles = await this.getResultTitles(5);
    const allText = titles.join(' ').toLowerCase();
    
    for (const term of terms) {
      const hasterm = allText.includes(term.toLowerCase());
      expect(hasterm).toBeTruthy();
    }
  }

  /**
   * Hacer clic en un resultado específico por posición
   * @param position - Posición del resultado (0-indexed)
   */
  async clickResultByPosition(position: number): Promise<void> {
    const result = this.resultLinks.nth(position);
    await result.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Hacer clic en un resultado que contenga texto específico
   * @param text - Texto que debe contener el resultado
   */
  async clickResultContaining(text: string): Promise<void> {
    const result = this.page.locator(`#search a:has-text("${text}")`).first();
    await result.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Obtener sugerencias de búsqueda
   */
  async getSuggestions(): Promise<string[]> {
    try {
      await this.suggestionsDropdown.waitFor({ timeout: 3000 });
      const suggestions = await this.suggestionsDropdown.locator('li').allTextContents();
      return suggestions.filter(suggestion => suggestion.trim().length > 0);
    } catch (error) {
      return [];
    }
  }

  /**
   * Verificar que la página de Google está cargada
   */
  async verifyGooglePageLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Google/);
    await expect(this.searchInput).toBeVisible();
  }
}
