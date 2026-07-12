import { dateRange, formatMonthYear } from '../../../lib/format';

export default function ModernTemplate({ data }) {
  const { personalInfo: p, experience, education, skills, languages, certifications, projects, references } = data;

  return (
    <div className="font-sans text-[11px] leading-snug text-gray-900">
      <header className="-mx-6 -mt-6 mb-4 bg-brand-600 px-6 py-5 text-white">
        <h1 className="text-2xl font-bold">
          {p.first_name || 'Your'} {p.last_name || 'Name'}
        </h1>
        {p.professional_title && <p className="mt-1 text-sm text-brand-50">{p.professional_title}</p>}
        <p className="mt-2 text-[10px] text-brand-50">
          {[p.email, p.phone, [p.city, p.country].filter(Boolean).join(', ')]
            .filter(Boolean)
            .join('   ·   ')}
        </p>
        <p className="text-[10px] text-brand-50">
          {[p.linkedin, p.github, p.portfolio].filter(Boolean).join('   ·   ')}
        </p>
      </header>

      {p.summary && (
        <section className="mb-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">
            Summary
          </h2>
          <p>{p.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">
            Experience
          </h2>
          <div className="space-y-2">
            {experience.map((exp, i) => (
              <div key={exp.id || i} className="border-l-2 border-brand-100 pl-3">
                <div className="flex justify-between font-semibold">
                  <span>{exp.position}</span>
                  <span className="text-[10px] font-normal text-gray-500">
                    {dateRange(exp.start_date, exp.end_date, exp.currently_working)}
                  </span>
                </div>
                <p className="text-[10px] text-brand-600">
                  {[exp.company, exp.location].filter(Boolean).join(' · ')}
                </p>
                {exp.responsibilities && (
                  <p className="mt-0.5 whitespace-pre-line">{exp.responsibilities}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-4">
        {education.length > 0 && (
          <section>
            <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">
              Education
            </h2>
            <div className="space-y-1.5">
              {education.map((edu, i) => (
                <div key={edu.id || i}>
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-[10px] text-gray-600">
                    {edu.institution} · {dateRange(edu.start_date, edu.end_date)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <span key={s} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] text-brand-700">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {projects.length > 0 && (
        <section className="mt-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">
            Projects
          </h2>
          <div className="space-y-1.5">
            {projects.map((proj, i) => (
              <div key={proj.id || i}>
                <p className="font-semibold">{proj.name}</p>
                {proj.description && <p>{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mt-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">
            Certifications
          </h2>
          <div className="space-y-1">
            {certifications.map((cert, i) => (
              <div key={cert.id || i} className="flex justify-between">
                <span>{[cert.name, cert.organization].filter(Boolean).join(' — ')}</span>
                <span className="text-[10px] text-gray-500">{formatMonthYear(cert.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {languages.length > 0 && (
        <section className="mt-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">
            Languages
          </h2>
          <p>{languages.map((l) => `${l.language} (${l.level})`).join(', ')}</p>
        </section>
      )}

      {references.length > 0 && (
        <section className="mt-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">
            References
          </h2>
          <div className="space-y-1">
            {references.map((ref, i) => (
              <div key={ref.id || i}>
                {[ref.name, ref.relationship && `(${ref.relationship})`, ref.email, ref.phone]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
