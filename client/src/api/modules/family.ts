import { FamilyMembersResponse } from '../../types/api';
import { FamilyMember } from '../../types/domain';
import api from '../axios';

/**
 * Loads the embedded family member list for the current user.
 */
export const getFamilyMembers = () => api.get<FamilyMembersResponse>('/family');

/**
 * Adds a new family member to the profile.
 */
export const addFamilyMember = (payload: FamilyMember) =>
  api.post<FamilyMembersResponse>('/family', payload);

/**
 * Updates one embedded family member document.
 */
export const updateFamilyMember = (memberId: string, payload: Partial<FamilyMember>) =>
  api.put<FamilyMembersResponse>(`/family/${memberId}`, payload);

/**
 * Removes one family member from the profile.
 */
export const deleteFamilyMember = (memberId: string) =>
  api.delete<FamilyMembersResponse>(`/family/${memberId}`);
