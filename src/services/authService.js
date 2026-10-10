import { authClient } from './api';

/** Le backend attend { username, password } : pour un compte créé via l'inscription, l'identifiant est l'e-mail. */
export async function login(username, password) {
  const { data } = await authClient.post('/auth/token/', { username, password });
  return data; // { access, refresh }
}

export async function refresh(refreshToken) {
  const { data } = await authClient.post('/auth/token/refresh/', { refresh: refreshToken });
  return data;
}

/** Inscription publique : crée l'utilisateur, sa fiche client et un premier compte bancaire. */
export async function register({ firstName, lastName, email, phone, password }) {
  const { data } = await authClient.post('/auth/register/', {
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    password,
  });
  return data;
}

/** Lecture locale des claims du JWT (information non sensible : user_id, exp). */
export function decodeToken(access) {
  try {
    const payload = access.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return {};
  }
}
