import { dateRange, formatMonthYear } from '../../../lib/format';

export default function MinimalTemplate({ data }) {
  const { personalInfo: p, experience, education, skills, languages, certifications, projects, references } = data;

  return (
    <div className="font-sans text-[11px] leading-relaxed text-gray-800">
      <header>
        <h1 className="text-2xl font-light tracking-wide text-gray-900">
          {p.first_name || 'Your'} {p.last_name || 'Name'}
        </h1>
        {p.professional_title && (
          <p className="mt-0.5 text-sm text-gray-500">{p.professional_title}</p>
        )}
        <p className="mt-2 text-[10px] text-gray-400">
          {[p.email, p.phone, [p.city, p.country].filter(Boolean).join(', '), p.linkedin, p.github, p.portfolio]
            .filter(Boolean)
            .join('    ')}
        </p>
      </header>

      {p.summary && (
        <section className="mt-5">
          <p className="text-gray-700">{p.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Experience
          </h2>
          <div className="mt-2 space-y-3">
            {experience.map((exp, i) => (
              <div key={exp.id || i}>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    {exp.position}
                    {exp.company && `, ${exp.company}`}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {dateRange(exp.start_date, exp.end_date, exp.currently_working)}
                  </span>
                </div>
                {exp.responsibilities && (
                  <p className="mt-0.5 whitespace-pre-line text-gray-600">
                    {exp.responsibilities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Education
          </h2>
          <div className="mt-2 space-y-1.5">
            {education.map((edu, i) => (
              <div key={edu.id || i} className="flex justify-between">
                <span className="text-gray-900">
                  {edu.degree} — {edu.institution}
                </span>
                <span className="text-[10px] text-gray-400">
                  {dateRange(edu.start_date, edu.end_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Skills
          </h2>
          <p className="mt-2 text-gray-600">{skills.join('   ·   ')}</p>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Projects
          </h2>
          <div className="mt-2 space-y-1.5">
            {projects.map((proj, i) => (
              <div key={proj.id || i}>
                <span className="text-gray-900">{proj.name}</span>
                {proj.description && <p className="text-gray-600">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Certifications
          </h2>
          <div className="mt-2 space-y-1">
            {certifications.map((cert, i) => (
              <div key={cert.id || i} className="flex justify-between text-gray-600">
                <span>{[cert.name, cert.organization].filter(Boolean).join(' — ')}</span>
                <span className="text-[10px] text-gray-400">{formatMonthYear(cert.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {languages.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Languages
          </h2>
          <p className="mt-2 text-gray-600">
            {languages.map((l) => `${l.language} (${l.level})`).join('   ·   ')}
          </p>
        </section>
      )}

      {references.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            References
          </h2>
          <div className="mt-2 space-y-1 text-gray-600">
            {references.map((ref, i) => (
              <div key={ref.id || i}>
                {[ref.name, ref.relationship && `(${ref.relationship})`, ref.email, ref.phone]
                  .filter(Boolean)
                  .join('   ·   ')}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
