export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary dark:bg-primary/20 dark:text-indigo-200">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base font-bold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
