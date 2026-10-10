import api from './api';
import { unwrapList } from '../utils/normalize';

export const getBeneficiaries = (params) => api.get('/beneficiaries/', { params });
export const getBeneficiary = (id) => api.get(`/beneficiaries/${id}/`);
export const createBeneficiary = (data) => api.post('/beneficiaries/', data);
export const updateBeneficiary = (id, data) => api.patch(`/beneficiaries/${id}/`, data);
export const deleteBeneficiary = (id) => api.delete(`/beneficiaries/${id}/`);

/** Formulaire UI -> payload API. Adaptez les clés au serializer (voir Swagger). */
export const toBeneficiaryPayload = (values) => ({
  name: values.name,
  account_number: values.accountNumber,
  bank_name: values.bank,
  is_active: values.active,
});

export async function getAllBeneficiaries() {
  let page = 1;
  let all = [];
  for (;;) {
    const { data } = await getBeneficiaries({ page });
    const { results, next } = unwrapList(data);
    all = all.concat(results);
    if (!next || page >= 20) break;
    page += 1;
  }
  return all;
}
