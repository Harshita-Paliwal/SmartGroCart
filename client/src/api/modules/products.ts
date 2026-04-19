import { ProductQueryParams, ProductsResponse, SeedProductsResponse } from '../../types/api';
import api from '../axios';

/**
 * Returns the product catalog, optionally filtered by category or search term.
 */
export const getProducts = (params?: ProductQueryParams) =>
  api.get<ProductsResponse>('/products', { params });

/**
 * Seeds demo products when the database is empty.
 */
export const seedProducts = () => api.post<SeedProductsResponse>('/products/seed');

/**
 * Rebuilds the demo catalog from scratch for local development.
 */
export const forceSeedProducts = () => api.post<SeedProductsResponse>('/products/seed/force');
