import { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

const Select = forwardRef(function Select({ label, error, hint, className = '', id, children, ...props }, ref) {
  const auto = useId();
  const selectId = id || auto;
  const descId = `${selectId}-desc`;
  const hasDesc = Boolean(error || hint);

  return (
    <div className={className}>
      <label htmlFor={selectId} className="field-label">
        {label}
      </label>
      <select
        ref={ref}
        id={selectId}
        className="field-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={hasDesc ? descId : undefined}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={descId} role="alert" className="field-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={descId} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Select;
