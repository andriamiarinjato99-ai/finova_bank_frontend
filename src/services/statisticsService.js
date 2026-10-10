import api from './api';

export const getStatistics = () => api.get('/statistics/');
