import api from './api';

export const getAgencies = (params) => api.get('/agencies/', { params });
export const getAgency = (id) => api.get(`/agencies/${id}/`);
