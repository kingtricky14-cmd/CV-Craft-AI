import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea({ label, error, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
      <textarea
        ref={ref}
        {...props}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-brand-500/40 ${
          error ? 'border-red-400' : 'border-gray-300 focus:border-brand-500'
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
});

export default Textarea;
