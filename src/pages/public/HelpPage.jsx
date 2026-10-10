import { Link } from 'react-router-dom';
import Faq from '../../components/common/Faq';

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="page-title">Centre d'aide</h1>
      <p className="mt-3 muted">Les réponses aux questions les plus fréquentes.</p>
      <div className="mt-8"><Faq /></div>
      <section className="card mt-10 p-5" aria-labelledby="contact-title">
        <h2 id="contact-title" className="text-lg font-bold">Vous ne trouvez pas votre réponse ?</h2>
        <p className="mt-1 text-sm muted">Ce projet de démonstration n'a pas de service client. Si l'application affiche « Impossible de contacter le serveur », vérifiez que le backend Django est lancé sur http://127.0.0.1:8000.</p>
        <Link to="/login" className="btn btn-secondary mt-4">Retour à la connexion</Link>
      </section>
    </div>
  );
}
