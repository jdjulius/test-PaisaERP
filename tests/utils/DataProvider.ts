import { readFileSync, existsSync, createReadStream, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as XLSX from 'xlsx';
import csvParser from 'csv-parser';

/**
 * Utilidad para manejo de datos de prueba
 * Soporte para JSON, CSV y Excel
 */
export class DataProvider {
  private static readonly DATA_DIR = join(process.cwd(), 'tests', 'data');

  /**
   * Leer datos desde archivo JSON
   * @param filename - Nombre del archivo JSON
   * @returns Datos parseados
   */
  static async readJsonData(filename: string): Promise<any[]> {
    const filePath = join(this.DATA_DIR, filename);
    
    if (!existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }

    const rawData = readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  }

  /**
   * Leer datos desde archivo CSV
   * @param filename - Nombre del archivo CSV
   * @returns Promise con array de datos
   */
  static async readCsvData(filename: string): Promise<any[]> {
    const filePath = join(this.DATA_DIR, filename);
    
    if (!existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }

    return new Promise((resolve, reject) => {
      const results: any[] = [];
      
      createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  /**
   * Leer datos desde archivo Excel
   * @param filename - Nombre del archivo Excel
   * @param sheetName - Nombre de la hoja (opcional, usa la primera por defecto)
   * @returns Array de datos
   */
  static async readExcelData(filename: string, sheetName?: string): Promise<any[]> {
    const filePath = join(this.DATA_DIR, filename);
    
    if (!existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = sheetName || workbook.SheetNames[0];
    
    if (!sheet || !workbook.Sheets[sheet]) {
      throw new Error(`Hoja no encontrada: ${sheet}`);
    }

    return XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  }

  /**
   * Obtener datos de usuario por ambiente
   * @param environment - Ambiente (dev, test, prod)
   * @returns Datos de usuario
   */
  static async getUserData(environment: string = 'test'): Promise<any> {
    const filename = `users-${environment}.json`;
    const users = await this.readJsonData(filename);
    return users;
  }

  /**
   * Obtener datos de prueba específicos por módulo
   * @param moduleName - Nombre del módulo del ERP
   * @returns Datos del módulo
   */
  static async getModuleTestData(moduleName: string): Promise<any[]> {
    const filename = `${moduleName}-testdata.json`;
    return await this.readJsonData(filename);
  }

  /**
   * Generar datos aleatorios para pruebas
   * @param type - Tipo de dato (email, phone, name, etc.)
   * @returns Dato generado
   */
  static generateRandomData(type: string): string {
    const timestamp = Date.now();
    
    switch (type) {
      case 'email':
        return `test${timestamp}@ejemplo.com`;
      case 'phone':
        return `+57${Math.floor(Math.random() * 9000000000) + 1000000000}`;
      case 'name':
        return `Usuario${timestamp}`;
      case 'company':
        return `Empresa${timestamp}`;
      case 'document':
        return `${Math.floor(Math.random() * 90000000) + 10000000}`;
      default:
        return `data${timestamp}`;
    }
  }

  /**
   * Filtrar datos por criterios específicos
   * @param data - Array de datos
   * @param criteria - Criterios de filtro
   * @returns Datos filtrados
   */
  static filterData(data: any[], criteria: Record<string, any>): any[] {
    return data.filter(item => {
      return Object.entries(criteria).every(([key, value]) => {
        return item[key] === value;
      });
    });
  }

  /**
   * Validar estructura de datos
   * @param data - Datos a validar
   * @param requiredFields - Campos requeridos
   * @returns True si es válido
   */
  static validateDataStructure(data: any[], requiredFields: string[]): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    return data.every(item => {
      return requiredFields.every(field => {
        return item.hasOwnProperty(field) && item[field] !== undefined;
      });
    });
  }

  /**
   * Crear archivo de datos de ejemplo
   * @param filename - Nombre del archivo
   * @param sampleData - Datos de ejemplo
   */
  static async createSampleDataFile(filename: string, sampleData: any[]): Promise<void> {
    const filePath = join(this.DATA_DIR, filename);
    
    // Crear directorio si no existe
    if (!existsSync(this.DATA_DIR)) {
      mkdirSync(this.DATA_DIR, { recursive: true });
    }

    writeFileSync(filePath, JSON.stringify(sampleData, null, 2));
  }
}
