import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

function emptyCertification() {
  return { _key: crypto.randomUUID(), name: '', organization: '', date: '' };
}

export default function CertificationsSection({ items, onChange }) {
  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const add = () => onChange([...items, emptyCertification()]);
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <Card
      title="Certifications"
      action={
        <Button variant="secondary" type="button" onClick={add}>
          + Add certification
        </Button>
      }
    >
      {items.length === 0 && (
        <p className="text-sm text-gray-400">No certifications added yet.</p>
      )}

      <div className="space-y-4">
        {items.map((cert, index) => (
          <div
            key={cert._key || cert.id || index}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Certification {index + 1}
              </span>
              <Button variant="ghost" type="button" onClick={() => remove(index)}>
                Delete
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input
                label="Name"
                value={cert.name || ''}
                onChange={(e) => update(index, 'name', e.target.value)}
              />
              <Input
                label="Organization"
                value={cert.organization || ''}
                onChange={(e) => update(index, 'organization', e.target.value)}
              />
              <Input
                label="Date"
                type="date"
                value={cert.date || ''}
                onChange={(e) => update(index, 'date', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
