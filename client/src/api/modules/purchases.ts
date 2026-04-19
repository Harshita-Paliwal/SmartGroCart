import { PurchaseQueryParams, PurchasesResponse } from '../../types/api';
import { PurchaseStatsResponse } from '../../types/domain';
import api from '../axios';

/**
 * Converts the active cart into a purchase record.
 */
export const checkout = () => api.post('/purchases/checkout');

/**
 * Loads purchase history entries for the history page.
 */
export const getPurchases = (params?: PurchaseQueryParams) =>
  api.get<PurchasesResponse>('/purchases', { params });

/**
 * Loads aggregated purchase stats for charts and dashboard cards.
 */
export const getPurchaseStats = () => api.get<PurchaseStatsResponse>('/purchases/stats');
