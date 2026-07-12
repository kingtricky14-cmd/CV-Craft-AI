// Keeping prompt construction in one place makes it easy to tune wording
// without hunting through controller logic.

function formatExperience(experience = []) {
  if (!experience.length) return 'None provided.';
  return experience
    .map((exp) => {
      const dates = [exp.start_date, exp.currently_working ? 'Present' : exp.end_date]
        .filter(Boolean)
        .join(' - ');
      const header = `${exp.position || 'Role'} at ${exp.company || 'a company'}${dates ? ` (${dates})` : ''}`;
      return `- ${header}: ${exp.responsibilities || 'no details provided'}`;
    })
    .join('\n');
}

function formatEducation(education = []) {
  if (!education.length) return 'None provided.';
  return education
    .map((edu) => {
      const line = [edu.degree, edu.course ? `in ${edu.course}` : null, edu.institution ? `— ${edu.institution}` : null]
        .filter(Boolean)
        .join(' ');
      return `- ${line}`;
    })
    .join('\n');
}

export function buildSummaryPrompt({ professionalTitle, experience, education, skills }) {
  return `You are helping a job seeker write the "Professional Summary" section of their resume.

Candidate details:
- Target job title: ${professionalTitle || 'Not specified'}
- Skills: ${skills?.length ? skills.join(', ') : 'Not specified'}
- Work experience:
${formatExperience(experience)}
- Education:
${formatEducation(education)}

Write a concise, ATS-friendly professional summary: 2-4 sentences, no more than 60 words total. Use a confident, resume-appropriate style (e.g. "Results-driven software engineer with..." — do not write in first person / do not use "I"). Only use facts given above — do not invent employers, numbers, or achievements that weren't mentioned. If very little information was given, write a solid general summary based on the job title and skills, and keep it easy for the candidate to edit further.

Return ONLY the summary text. No preamble, no quotation marks, no markdown formatting.`;
}

export function buildCoverLetterPrompt({ company, position, hiringManager, personalInfo = {}, experience, skills }) {
  const name = [personalInfo.first_name, personalInfo.last_name].filter(Boolean).join(' ');

  return `You are helping a job seeker write the body of a cover letter.

Job details:
- Company: ${company || 'Not specified'}
- Position: ${position || 'Not specified'}
- Hiring manager: ${hiringManager || 'Hiring Manager'}

Candidate background:
- Name: ${name || 'Not specified'}
- Target title: ${personalInfo.professional_title || 'Not specified'}
- Existing resume summary: ${personalInfo.summary || 'Not specified'}
- Skills: ${skills?.length ? skills.join(', ') : 'Not specified'}
- Work experience:
${formatExperience(experience)}

Write ONLY the body paragraphs of a professional cover letter (3-4 short paragraphs). Do NOT include a greeting line ("Dear...") or a sign-off ("Sincerely...") — the app adds those separately. Tailor it to the specific company and position using only the background facts given above; do not invent employers, achievements, or numbers that weren't mentioned. If little background was provided, write a strong, flexible general-purpose draft the candidate can easily fill in with specifics.

Return ONLY the letter body text. No preamble, no markdown, no quotation marks.`;
}
