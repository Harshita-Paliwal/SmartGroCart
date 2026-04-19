import { AuthResponse, CurrentUserResponse, LoginPayload, RegisterPayload, UpdateProfilePayload } from '../../types/api';
import api from '../axios';

/**
 * Creates a new account and returns the authenticated session payload.
 */
export const register = (payload: RegisterPayload) => api.post<AuthResponse>('/auth/register', payload);

/**
 * Logs a user in with username and password credentials.
 */
export const login = (payload: LoginPayload) => api.post<AuthResponse>('/auth/login', payload);

/**
 * Fetches the currently authenticated user's profile.
 */
export const getCurrentUser = () => api.get<CurrentUserResponse>('/auth/me');

/**
 * Updates the profile fields shown on the settings screen.
 */
export const updateProfile = (payload: UpdateProfilePayload) =>
  api.put<CurrentUserResponse>('/auth/profile', payload);
