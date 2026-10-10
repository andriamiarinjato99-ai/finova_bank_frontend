import { Link } from 'react-router-dom';
import { ArrowLeftRight, CreditCard, LineChart, Lock, PiggyBank, Wallet } from 'lucide-react';
import { TESTIMONIALS } from '../../data/fallbackData';
import Faq from '../../components/common/Faq';
import DemoBadge from '../../components/common/DemoBadge';

function Section({ id, title, intro, children }) {
  return (
    <section aria-labelledby={id} className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <h2 id={id} className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {intro && <p className="mt-3 max-w-2xl muted">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Row({ icon: Icon, title, text, children, flip }) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <div className={flip ? 'md:order-2' : ''}>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-dark dark:bg-primary/20 dark:text-indigo-200"><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <h3 className="mt-4 text-2xl font-extrabold tracking-tight">{title}</h3>
        <p className="mt-2 max-w-md leading-relaxed muted">{text}</p>
      </div>
      <div className={flip ? 'md:order-1' : ''}>{children}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-14 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-2 lg:pb-24">
        <div>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Votre argent.
            <br />
            Plus simple. Plus clair. Plus Finova.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed muted">
            Comptes, virements et statistiques réunis dans une interface claire, pensée pour le téléphone comme pour l'ordinateur.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn btn-primary px-6">Ouvrir un compte</Link>
            <Link to="/features" className="btn btn-secondary px-6">Découvrir Finova</Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
          <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative rotate-[-3deg] rounded-2xl bg-gradient-to-br from-primary via-indigo-600 to-slate-900 p-6 text-white shadow-lift">
            <div className="flex items-center justify-between text-sm font-extrabold tracking-wide"><span>FINOVA</span><span className="rounded-md bg-white/20 px-2 py-0.5 text-xs">Virtual</span></div>
            <p className="mt-10 font-mono text-xl tracking-widest">•••• •••• •••• 4821</p>
            <div className="mt-6 flex justify-between text-sm font-semibold"><span>AINA RAKOTO</span><span>09/29</span></div>
          </div>
          <div className="card relative -mt-8 ml-8 rotate-[2deg] p-4">
            <p className="text-xs muted">Solde du compte principal (exemple)</p>
            <p className="mt-1 text-2xl font-extrabold">2 450,75 €</p>
            <p className="mt-1 text-xs muted">Illustration fictive</p>
          </div>
        </div>
      </section>

      <div className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Section id="why" title="Pourquoi Finova" intro="Une application bancaire qui montre l'essentiel et demande confirmation avant chaque opération sensible.">
          <ul className="grid gap-6 sm:grid-cols-3">
            {[
              ['Lisible', "Vos soldes, vos transactions et vos statistiques sont présentés sans jargon."],
              ['Vérifiée par le serveur', "Chaque dépôt, retrait ou virement est validé et enregistré par le backend, jamais par le navigateur."],
              ['Partout avec vous', "Mobile, tablette ou ordinateur : l'interface s'adapte, au clavier comme au toucher."],
            ].map(([t, d]) => (
              <li key={t}><h3 className="text-lg font-bold">{t}</h3><p className="mt-1 text-sm leading-relaxed muted">{d}</p></li>
            ))}
          </ul>
        </Section>
      </div>

      <Section id="accounts" title="Vos comptes, d'un coup d'œil">
        <div className="space-y-16">
          <Row icon={Wallet} title="Vos comptes" text="Type, solde, devise, agence et statut. Les numéros sont toujours masqués : seuls les quatre derniers chiffres sont visibles.">
            <div className="card p-5"><p className="font-bold">Compte principal</p><p className="mt-1 font-mono text-sm tracking-wider muted">•••• •••• •••• 4821</p><p className="mt-3 text-3xl font-extrabold">2 450,75 €</p><span className="badge badge-success mt-2">Actif</span><p className="mt-3 text-xs muted">Exemple fictif</p></div>
          </Row>
          <Row flip icon={ArrowLeftRight} title="Transferts" text="Choisissez le compte, le bénéficiaire, le montant, puis vérifiez le récapitulatif avant de confirmer. Rien ne part sans votre accord.">
            <ol className="card divide-y divide-slate-100 dark:divide-slate-800">
              {['Compte source', 'Bénéficiaire', 'Montant', 'Récapitulatif', 'Confirmation'].map((s, i) => (
                <li key={s} className="flex items-center gap-3 p-3 text-sm font-semibold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-white">{i + 1}</span>{s}</li>
              ))}
            </ol>
          </Row>
          <Row icon={CreditCard} title="Cartes" text="Une section cartes avec blocage et déblocage. Dans cette démonstration, les cartes sont fictives et l'action reste locale.">
            <div className="flex flex-col items-start gap-3"><DemoBadge label="Carte de démonstration" /><div className="aspect-[1.586/1] w-full max-w-xs rounded-2xl bg-gradient-to-br from-slate-800 to-primary p-5 text-white shadow-lift"><p className="text-sm font-extrabold">FINOVA</p><p className="mt-8 font-mono tracking-widest">•••• 1096</p></div></div>
          </Row>
          <Row flip icon={PiggyBank} title="Épargne" text="Fixez des objectifs et suivez leur progression. Les objectifs sont des données de démonstration : aucun argent réel n'est déplacé.">
            <div className="card p-5"><p className="font-bold">Voyage à l'île Maurice</p><p className="mt-1 text-sm muted">860 € / 1 500 €</p><div className="mt-3 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full w-[57%] rounded-full bg-primary" /></div><p className="mt-2 text-sm font-semibold">57 %</p></div>
          </Row>
          <Row icon={Lock} title="Sécurité" text="Session JWT, expiration gérée automatiquement, routes protégées. Les règles critiques sont vérifiées par le serveur, pas par l'interface.">
            <ul className="card space-y-2 p-5 text-sm font-semibold">{['Numéros de compte masqués', 'Confirmation avant chaque opération', 'Déconnexion automatique à l’expiration'].map((x) => <li key={x}>✓ {x}</li>)}</ul>
          </Row>
          <Row flip icon={LineChart} title="Statistiques" text="Comptes, soldes, dépôts, retraits et virements, lus depuis le serveur. Quand une évolution n'est pas fournie, elle n'est pas inventée.">
            <div className="card grid grid-cols-2 gap-3 p-5 text-sm"><div><p className="muted">Comptes</p><p className="text-xl font-extrabold">—</p></div><div><p className="muted">Transactions</p><p className="text-xl font-extrabold">—</p></div><p className="col-span-2 text-xs muted">Données d'évolution indisponibles</p></div>
          </Row>
        </div>
      </Section>

      <div className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Section id="testimonials" title="Ils en parlent" intro="Témoignages fictifs, rédigés pour la démonstration.">
          <ul className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <li key={t.name} className="card p-5">
                <p className="leading-relaxed">« {t.text} »</p>
                <p className="mt-4 text-sm font-bold">{t.name}</p>
                <p className="text-xs muted">{t.role}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section id="faq" title="Questions fréquentes"><Faq /></Section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-indigo-800 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Prêt à essayer Finova ?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/85">Créez un compte en quelques secondes, puis déposez, retirez et envoyez de l'argent à un autre client.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" className="btn bg-white text-primary-dark hover:bg-slate-100">Se connecter</Link>
            <Link to="/register" className="btn border border-white/50 text-white hover:bg-white/10">Ouvrir un compte</Link>
          </div>
        </div>
      </section>
    </>
  );
}
