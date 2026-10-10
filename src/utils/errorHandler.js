const FIELD_LABELS = {
  amount: 'Montant',
  account_id: 'Compte',
  source_account_id: 'Compte source',
  destination_account_id: 'Compte destination',
  description: 'Description',
  name: 'Nom',
  account_number: 'Numéro de compte',
  bank_name: 'Banque',
  username: 'Identifiant',
  first_name: 'Prénom',
  last_name: 'Nom',
  password: 'Mot de passe',
  email: 'E-mail',
  phone: 'Téléphone',
  detail: '',
  non_field_errors: '',
};

function flatten(data) {
  if (data == null) return [];
  if (typeof data === 'string') return [data];
  if (Array.isArray(data)) return data.flatMap(flatten);
  if (typeof data === 'object') {
    return Object.entries(data).flatMap(([key, value]) => {
      const messages = flatten(value);
      const label = FIELD_LABELS[key];
      return label ? messages.map((m) => `${label} : ${m}`) : messages;
    });
  }
  return [String(data)];
}

/** Transforme n'importe quelle erreur Axios en message lisible en français. */
export function getErrorMessage(error, fallback = 'Une erreur est survenue. Réessayez.') {
  if (!error) return fallback;
  if (error.code === 'ECONNABORTED') {
    return 'Le serveur met trop de temps à répondre. Réessayez dans quelques instants.';
  }
  if (!error.response) {
    return 'Impossible de contacter le serveur. Vérifiez que le backend Django est lancé.';
  }
  const { status, data } = error.response;
  switch (status) {
    case 400: {
      const text = flatten(data).join(' ');
      return text || 'Les informations envoyées sont invalides.';
    }
    case 401:
      return 'Identifiants incorrects ou session expirée. Veuillez vous reconnecter.';
    case 403:
      return "Vous n'avez pas l'autorisation d'effectuer cette action.";
    case 429:
      return 'Trop de tentatives. Patientez quelques minutes avant de réessayer.';
    case 404:
      return 'Ressource introuvable.';
    default:
      if (status >= 500) return 'Le serveur a rencontré un problème. Réessayez dans quelques instants.';
      return fallback;
  }
}
