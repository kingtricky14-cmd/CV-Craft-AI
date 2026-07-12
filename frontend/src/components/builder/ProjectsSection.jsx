import Card from '../ui/Card';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

function emptyProject() {
  return { _key: crypto.randomUUID(), name: '', description: '', github: '', demo: '' };
}

export default function ProjectsSection({ items, onChange }) {
  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const add = () => onChange([...items, emptyProject()]);
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <Card
      title="Projects"
      action={
        <Button variant="secondary" type="button" onClick={add}>
          + Add project
        </Button>
      }
    >
      {items.length === 0 && <p className="text-sm text-gray-400">No projects added yet.</p>}

      <div className="space-y-4">
        {items.map((proj, index) => (
          <div
            key={proj._key || proj.id || index}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Project {index + 1}</span>
              <Button variant="ghost" type="button" onClick={() => remove(index)}>
                Delete
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Project name"
                value={proj.name || ''}
                onChange={(e) => update(index, 'name', e.target.value)}
                className="sm:col-span-2"
              />
              <Input
                label="GitHub link"
                value={proj.github || ''}
                onChange={(e) => update(index, 'github', e.target.value)}
              />
              <Input
                label="Live demo link"
                value={proj.demo || ''}
                onChange={(e) => update(index, 'demo', e.target.value)}
              />
            </div>
            <div className="mt-3">
              <Textarea
                label="Description"
                rows={3}
                value={proj.description || ''}
                onChange={(e) => update(index, 'description', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
