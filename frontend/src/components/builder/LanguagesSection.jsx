import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LEVELS = ['Basic', 'Intermediate', 'Fluent', 'Native'];

function emptyLanguage() {
  return { _key: crypto.randomUUID(), language: '', level: 'Fluent' };
}

export default function LanguagesSection({ items, onChange }) {
  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const add = () => onChange([...items, emptyLanguage()]);
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <Card
      title="Languages"
      action={
        <Button variant="secondary" type="button" onClick={add}>
          + Add language
        </Button>
      }
    >
      {items.length === 0 && <p className="text-sm text-gray-400">No languages added yet.</p>}

      <div className="space-y-3">
        {items.map((lang, index) => (
          <div key={lang._key || lang.id || index} className="flex items-end gap-3">
            <Input
              label="Language"
              value={lang.language || ''}
              onChange={(e) => update(index, 'language', e.target.value)}
              className="flex-1"
            />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Level</span>
              <select
                value={lang.level || 'Fluent'}
                onChange={(e) => update(index, 'level', e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <Button variant="ghost" type="button" onClick={() => remove(index)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
