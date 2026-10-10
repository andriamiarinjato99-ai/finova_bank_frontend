import api from './api';
import { normalizeClient } from '../utils/normalize';

export const getClients = (params) => api.get('/clients/', { params });
export const getClient = (id) => api.get(`/clients/${id}/`);
export const createClient = (data) => api.post('/clients/', data);
export const updateClient = (id, data) => api.patch(`/clients/${id}/`, data);

/** Récupère uniquement la fiche client liée à la session JWT. */
export async function getCurrentClient() {
  const { data } = await api.get('/clients/me/');
  return normalizeClient(data);
}
