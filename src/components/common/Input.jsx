import { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(function Input({ label, error, hint, className = '', id, ...props }, ref) {
  const auto = useId();
  const inputId = id || auto;
  const descId = `${inputId}-desc`;
  const hasDesc = Boolean(error || hint);

  return (
    <div className={className}>
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className="field-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={hasDesc ? descId : undefined}
        {...props}
      />
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

export default Input;
