const TEMPLATES = [
  { id: 'classic', name: 'Classic', description: 'Traditional, ATS-safe layout' },
  { id: 'modern', name: 'Modern', description: 'Bold accent color, clean sections' },
  { id: 'minimal', name: 'Minimal', description: 'Lots of whitespace, understated' },
  { id: 'enhanced', name: 'Enhanced', description: 'Two-column with profile photo' },
];

export default function TemplateSelector({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {TEMPLATES.map((tpl) => (
        <button
          key={tpl.id}
          type="button"
          onClick={() => onChange(tpl.id)}
          title={tpl.description}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
            value === tpl.id
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-gray-300 text-gray-600 hover:border-gray-400'
          }`}
        >
          {tpl.name}
        </button>
      ))}
    </div>
  );
}
