import Card from '../ui/Card';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import ImageUploadCrop from './ImageUploadCrop';

export default function PersonalInfoSection({ data, onChange, onGenerateSummary, generatingSummary }) {
  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  return (
    <Card title="Personal information" description="This appears at the top of your resume.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input label="First name" value={data.first_name || ''} onChange={set('first_name')} />
        <Input label="Last name" value={data.last_name || ''} onChange={set('last_name')} />
        <Input
          label="Professional title"
          value={data.professional_title || ''}
          onChange={set('professional_title')}
          placeholder="e.g. Software Engineer"
          className="sm:col-span-2"
        />
        <Input label="Email" type="email" value={data.email || ''} onChange={set('email')} />
        <Input label="Phone" value={data.phone || ''} onChange={set('phone')} />
        <Input label="Country" value={data.country || ''} onChange={set('country')} />
        <Input label="City" value={data.city || ''} onChange={set('city')} />
        <Input label="LinkedIn" value={data.linkedin || ''} onChange={set('linkedin')} />
        <Input label="GitHub" value={data.github || ''} onChange={set('github')} />
        <Input
          label="Portfolio website"
          value={data.portfolio || ''}
          onChange={set('portfolio')}
        />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="block text-sm font-medium text-gray-700">Professional summary</span>
          {onGenerateSummary && (
            <button
              type="button"
              onClick={onGenerateSummary}
              disabled={generatingSummary}
              className="rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingSummary ? 'Generating...' : '✨ Generate with AI'}
            </button>
          )}
        </div>
        <Textarea
          rows={4}
          value={data.summary || ''}
          onChange={set('summary')}
          placeholder="A 2-3 sentence summary of your experience and strengths, or click Generate with AI above..."
        />
      </div>

      <div className="mt-6">
        <ImageUploadCrop
          value={data.photo_url || null}
          onChange={(photo_url) => onChange({ ...data, photo_url })}
        />
      </div>
    </Card>
  );
}
