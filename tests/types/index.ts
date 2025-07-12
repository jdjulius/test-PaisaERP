/**
 * Tipos de datos compartidos para el proyecto de automatización
 */

/**
 * Datos de usuario
 */
export interface UserData {
  id: number;
  username: string;
  password: string;
  email: string;
  role: 'administrator' | 'user' | 'viewer' | 'manager';
  company: string;
  active: boolean;
  permissions: string[];
  profile?: {
    firstName?: string;
    lastName?: string;
    department?: string;
    phone?: string;
  };
}

/**
 * Datos de empresa
 */
export interface CompanyData {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  active: boolean;
}

/**
 * Datos de producto
 */
export interface ProductData {
  id: number;
  name: string;
  code: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  active: boolean;
}

/**
 * Datos de cliente
 */
export interface CustomerData {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  taxId: string;
  active: boolean;
}

/**
 * Datos de factura
 */
export interface InvoiceData {
  id: number;
  number: string;
  customerId: number;
  date: string;
  dueDate: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
}

/**
 * Item de factura
 */
export interface InvoiceItem {
  productId: number;
  quantity: number;
  price: number;
  total: number;
}

/**
 * Configuración de test
 */
export interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  workers: number;
  headless: boolean;
  slowMo: number;
}

/**
 * Resultado de test
 */
export interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshots?: string[];
}

/**
 * Configuración de ambiente
 */
export interface EnvironmentConfig {
  name: 'dev' | 'test' | 'staging' | 'prod';
  baseUrl: string;
  dbConfig: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  apiConfig: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
}

/**
 * Datos de login
 */
export interface LoginCredentials {
  username: string;
  password: string;
  company?: string;
  rememberMe?: boolean;
}

/**
 * Respuesta de API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

/**
 * Filtros de búsqueda
 */
export interface SearchFilters {
  [key: string]: any;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Datos de reporte
 */
export interface ReportData {
  id: number;
  name: string;
  type: 'sales' | 'inventory' | 'financial' | 'customer';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  parameters: Record<string, any>;
}

/**
 * Configuración de módulo
 */
export interface ModuleConfig {
  name: string;
  enabled: boolean;
  permissions: string[];
  routes: string[];
  dependencies: string[];
}
