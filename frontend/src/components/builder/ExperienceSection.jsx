import Card from '../ui/Card';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

function emptyExperience() {
  return {
    _key: crypto.randomUUID(),
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    responsibilities: '',
  };
}

export default function ExperienceSection({ items, onChange }) {
  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const add = () => onChange([...items, emptyExperience()]);
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <Card
      title="Work experience"
      description="Add your roles, most recent first."
      action={
        <Button variant="secondary" type="button" onClick={add}>
          + Add experience
        </Button>
      }
    >
      {items.length === 0 && (
        <p className="text-sm text-gray-400">No experience added yet.</p>
      )}

      <div className="space-y-4">
        {items.map((exp, index) => (
          <div
            key={exp._key || exp.id || index}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Experience {index + 1}
              </span>
              <Button variant="ghost" type="button" onClick={() => remove(index)}>
                Delete
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Company"
                value={exp.company || ''}
                onChange={(e) => update(index, 'company', e.target.value)}
              />
              <Input
                label="Position"
                value={exp.position || ''}
                onChange={(e) => update(index, 'position', e.target.value)}
              />
              <Input
                label="Location"
                value={exp.location || ''}
                onChange={(e) => update(index, 'location', e.target.value)}
                className="sm:col-span-2"
              />
              <Input
                label="Start date"
                type="date"
                value={exp.start_date || ''}
                onChange={(e) => update(index, 'start_date', e.target.value)}
              />
              <Input
                label="End date"
                type="date"
                value={exp.end_date || ''}
                onChange={(e) => update(index, 'end_date', e.target.value)}
                disabled={exp.currently_working}
              />
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={!!exp.currently_working}
                onChange={(e) => update(index, 'currently_working', e.target.checked)}
              />
              I currently work here
            </label>

            <div className="mt-3">
              <Textarea
                label="Responsibilities"
                rows={3}
                value={exp.responsibilities || ''}
                onChange={(e) => update(index, 'responsibilities', e.target.value)}
                placeholder="Describe your key achievements and responsibilities..."
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
