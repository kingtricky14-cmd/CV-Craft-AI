import { dateRange, formatMonthYear } from '../../../lib/format';

export default function EnhancedTemplate({ data }) {
  const { personalInfo: p, experience, education, skills, languages, certifications, projects, references } = data;

  // Render proficiency dots for languages
  const renderProficiencyDots = (level) => {
    const levels = { beginner: 1, intermediate: 2, advanced: 3, fluent: 4, native: 5 };
    const count = levels[level?.toLowerCase()] || 3;
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i < count ? 'bg-blue-600' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="font-sans text-[10px] leading-relaxed text-gray-900">
      {/* Header with two-column layout */}
      <header className="mb-4 border-b border-gray-300 pb-3">
        <div className="flex justify-between items-start">
          {/* Left side: Name, tagline, contact */}
          <div>
            <h1 className="text-2xl font-bold">
              {p.first_name || 'Your'} {p.last_name || 'Name'}
            </h1>
            {p.professional_title && (
              <p className="mt-0.5 text-sm text-blue-600 font-semibold">{p.professional_title}</p>
            )}
            <div className="mt-2 space-y-0.5 text-[9px] text-gray-600">
              {p.phone && <p>📱 {p.phone}</p>}
              {p.email && <p>📧 {p.email}</p>}
              {p.linkedin && <p>💼 {p.linkedin}</p>}
              {p.github && <p>🐙 {p.github}</p>}
              {[p.city, p.country].filter(Boolean).join(', ') && (
                <p>📍 {[p.city, p.country].filter(Boolean).join(', ')}</p>
              )}
            </div>
          </div>

          {/* Right side: Profile photo placeholder */}
          <div className="flex-shrink-0">
            {p.photo_url ? (
              <img
                src={p.photo_url}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-gray-400 text-xs text-center px-1">
                {p.first_name && p.last_name ? `${p.first_name}\n${p.last_name}` : 'Photo'}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Two-column main content */}
      <div className="grid grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wide border-b-2 border-gray-800 pb-1 mb-2">
                Experience
              </h2>
              <div className="space-y-2.5">
                {experience.map((exp, i) => (
                  <div key={exp.id || i}>
                    <p className="font-semibold">{exp.position}</p>
                    <p className="text-blue-600 font-semibold text-[10px]">{exp.company}</p>
                    <p className="text-[9px] text-gray-600">
                      📅 {dateRange(exp.start_date, exp.end_date, exp.currently_working)}
                      {exp.location && ` 📍 ${exp.location}`}
                    </p>
                    {exp.responsibilities && (
                      <ul className="mt-1 ml-4 space-y-0.5 list-disc text-[9px] text-gray-700">
                        {exp.responsibilities.split('\n').map((resp, idx) => (
                          resp.trim() && <li key={idx}>{resp.trim()}</li>
                        ))}
                      </ul>
                    )}
                    {i < experience.length - 1 && <div className="my-1 border-t border-dashed border-gray-300" />}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wide border-b-2 border-gray-800 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-1.5">
                {education.map((edu, i) => (
                  <div key={edu.id || i}>
                    <p className="font-semibold">{edu.degree}</p>
                    <p className="text-blue-600 text-[10px]">{edu.institution}</p>
                    <p className="text-[9px] text-gray-600">📅 {dateRange(edu.start_date, edu.end_date)}</p>
                    {i < education.length - 1 && <div className="my-1 border-t border-dashed border-gray-300" />}
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wide border-b-2 border-gray-800 pb-1 mb-2">
                Strengths
              </h2>
              <div className="space-y-1.5">
                {skills.map((skill, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 text-xs mt-0.5">⭐</span>
                    <div>
                      <p className="font-semibold">{skill}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wide border-b-2 border-gray-800 pb-1 mb-2">
                Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj, i) => (
                  <div key={proj.id || i}>
                    <p className="font-semibold">{proj.name}</p>
                    {proj.description && <p className="text-[9px] text-gray-700 mt-0.5">{proj.description}</p>}
                    {i < projects.length - 1 && <div className="my-1 border-t border-dashed border-gray-300" />}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wide border-b-2 border-gray-800 pb-1 mb-2">
                Achievements
              </h2>
              <div className="space-y-1.5">
                {certifications.map((cert, i) => (
                  <div key={cert.id || i} className="flex items-start gap-2">
                    <span className="text-blue-600 text-xs mt-0.5">💎</span>
                    <div>
                      <p className="font-semibold">{cert.name}</p>
                      {cert.organization && <p className="text-[9px] text-gray-600">{cert.organization}</p>}
                      {cert.date && <p className="text-[9px] text-gray-600">📅 {formatMonthYear(cert.date)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wide border-b-2 border-gray-800 pb-1 mb-2">
                Languages
              </h2>
              <div className="space-y-2">
                {languages.map((lang, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{lang.language}</p>
                      <p className="text-[9px] text-gray-600 capitalize">{lang.level}</p>
                    </div>
                    {renderProficiencyDots(lang.level)}
                  </div>
                ))}
              </div>
            </section>
          )}

          {references.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wide border-b-2 border-gray-800 pb-1 mb-2">
                References
              </h2>
              <div className="space-y-1.5">
                {references.map((ref, i) => (
                  <div key={ref.id || i} className="text-[9px]">
                    <p className="font-semibold">{ref.name}</p>
                    {ref.relationship && <p className="text-gray-600">{ref.relationship}</p>}
                    {(ref.email || ref.phone) && (
                      <p className="text-gray-600">{[ref.email, ref.phone].filter(Boolean).join(' · ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
