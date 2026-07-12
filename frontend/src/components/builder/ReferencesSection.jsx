import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

function emptyReference() {
  return { _key: crypto.randomUUID(), name: '', relationship: '', email: '', phone: '' };
}

export default function ReferencesSection({ items, onChange }) {
  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const add = () => onChange([...items, emptyReference()]);
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <Card
      title="References"
      description="Optional."
      action={
        <Button variant="secondary" type="button" onClick={add}>
          + Add reference
        </Button>
      }
    >
      {items.length === 0 && <p className="text-sm text-gray-400">No references added.</p>}

      <div className="space-y-4">
        {items.map((ref, index) => (
          <div
            key={ref._key || ref.id || index}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Reference {index + 1}</span>
              <Button variant="ghost" type="button" onClick={() => remove(index)}>
                Delete
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Name"
                value={ref.name || ''}
                onChange={(e) => update(index, 'name', e.target.value)}
              />
              <Input
                label="Relationship"
                value={ref.relationship || ''}
                onChange={(e) => update(index, 'relationship', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={ref.email || ''}
                onChange={(e) => update(index, 'email', e.target.value)}
              />
              <Input
                label="Phone"
                value={ref.phone || ''}
                onChange={(e) => update(index, 'phone', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
