import api from './api';

export const getEmployees = (params) => api.get('/employees/', { params });
export const getEmployee = (id) => api.get(`/employees/${id}/`);
