import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

function emptyEducation() {
  return {
    _key: crypto.randomUUID(),
    institution: '',
    degree: '',
    course: '',
    gpa: '',
    start_date: '',
    end_date: '',
  };
}

export default function EducationSection({ items, onChange }) {
  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const add = () => onChange([...items, emptyEducation()]);
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <Card
      title="Education"
      action={
        <Button variant="secondary" type="button" onClick={add}>
          + Add education
        </Button>
      }
    >
      {items.length === 0 && <p className="text-sm text-gray-400">No education added yet.</p>}

      <div className="space-y-4">
        {items.map((edu, index) => (
          <div
            key={edu._key || edu.id || index}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Education {index + 1}</span>
              <Button variant="ghost" type="button" onClick={() => remove(index)}>
                Delete
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Institution"
                value={edu.institution || ''}
                onChange={(e) => update(index, 'institution', e.target.value)}
                className="sm:col-span-2"
              />
              <Input
                label="Degree"
                value={edu.degree || ''}
                onChange={(e) => update(index, 'degree', e.target.value)}
              />
              <Input
                label="Course / field of study"
                value={edu.course || ''}
                onChange={(e) => update(index, 'course', e.target.value)}
              />
              <Input
                label="GPA"
                value={edu.gpa || ''}
                onChange={(e) => update(index, 'gpa', e.target.value)}
              />
              <Input
                label="Start date"
                type="date"
                value={edu.start_date || ''}
                onChange={(e) => update(index, 'start_date', e.target.value)}
              />
              <Input
                label="End date"
                type="date"
                value={edu.end_date || ''}
                onChange={(e) => update(index, 'end_date', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
