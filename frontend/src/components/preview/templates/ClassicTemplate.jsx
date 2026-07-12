import { dateRange, formatMonthYear } from '../../../lib/format';

export default function ClassicTemplate({ data }) {
  const { personalInfo: p, experience, education, skills, languages, certifications, projects, references } = data;

  return (
    <div className="font-serif text-[11px] leading-snug text-gray-900">
      <header className="border-b-2 border-gray-800 pb-3 text-center">
        <h1 className="text-2xl font-bold tracking-wide">
          {p.first_name || 'Your'} {p.last_name || 'Name'}
        </h1>
        {p.professional_title && <p className="mt-1 text-sm">{p.professional_title}</p>}
        <p className="mt-1 text-[10px] text-gray-600">
          {[p.email, p.phone, [p.city, p.country].filter(Boolean).join(', ')]
            .filter(Boolean)
            .join('  |  ')}
        </p>
        <p className="text-[10px] text-gray-600">
          {[p.linkedin, p.github, p.portfolio].filter(Boolean).join('  |  ')}
        </p>
      </header>

      {p.summary && (
        <section className="mt-3">
          <h2 className="border-b border-gray-400 text-xs font-bold uppercase tracking-wider">
            Summary
          </h2>
          <p className="mt-1">{p.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-gray-400 text-xs font-bold uppercase tracking-wider">
            Experience
          </h2>
          <div className="mt-1 space-y-2">
            {experience.map((exp, i) => (
              <div key={exp.id || i}>
                <div className="flex justify-between font-semibold">
                  <span>
                    {exp.position} {exp.company && `— ${exp.company}`}
                  </span>
                  <span className="text-[10px] font-normal text-gray-600">
                    {dateRange(exp.start_date, exp.end_date, exp.currently_working)}
                  </span>
                </div>
                {exp.location && <p className="text-[10px] text-gray-600">{exp.location}</p>}
                {exp.responsibilities && (
                  <p className="mt-0.5 whitespace-pre-line">{exp.responsibilities}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-gray-400 text-xs font-bold uppercase tracking-wider">
            Education
          </h2>
          <div className="mt-1 space-y-1.5">
            {education.map((edu, i) => (
              <div key={edu.id || i} className="flex justify-between">
                <span>
                  <span className="font-semibold">{edu.degree}</span>
                  {edu.course && `, ${edu.course}`} — {edu.institution}
                </span>
                <span className="text-[10px] text-gray-600">
                  {dateRange(edu.start_date, edu.end_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-gray-400 text-xs font-bold uppercase tracking-wider">
            Skills
          </h2>
          <p className="mt-1">{skills.join(', ')}</p>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-gray-400 text-xs font-bold uppercase tracking-wider">
            Projects
          </h2>
          <div className="mt-1 space-y-1.5">
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
          <h2 className="border-b border-gray-400 text-xs font-bold uppercase tracking-wider">
            Certifications
          </h2>
          <div className="mt-1 space-y-1">
            {certifications.map((cert, i) => (
              <div key={cert.id || i} className="flex justify-between">
                <span>
                  {cert.name} {cert.organization && `— ${cert.organization}`}
                </span>
                <span className="text-[10px] text-gray-600">{formatMonthYear(cert.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {languages.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-gray-400 text-xs font-bold uppercase tracking-wider">
            Languages
          </h2>
          <p className="mt-1">
            {languages.map((l) => `${l.language} (${l.level})`).join(', ')}
          </p>
        </section>
      )}

      {references.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-gray-400 text-xs font-bold uppercase tracking-wider">
            References
          </h2>
          <div className="mt-1 space-y-1">
            {references.map((ref, i) => (
              <div key={ref.id || i}>
                {ref.name} {ref.relationship && `(${ref.relationship})`} —{' '}
                {[ref.email, ref.phone].filter(Boolean).join(', ')}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
