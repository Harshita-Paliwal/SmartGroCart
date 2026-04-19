import { ExpiryAlertsResponse } from '../../types/api';
import { SuggestionsResponse } from '../../types/domain';
import api from '../axios';

/**
 * Fetches rule-based shopping suggestions from recent purchase history.
 */
export const getSuggestions = () => api.get<SuggestionsResponse>('/suggestions');

/**
 * Fetches items that are close to their expected expiry date.
 */
export const getExpiryAlerts = () => api.get<ExpiryAlertsResponse>('/suggestions/expiry');

/**
 * Requests optional AI-generated suggestions from the backend.
 */
export const getAiSuggestions = () => api.post('/suggestions/ai');
