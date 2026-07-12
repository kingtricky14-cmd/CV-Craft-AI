function formatExperience(experience = []) {
  if (!experience.length) return 'No experience details were provided.';

  return experience
    .slice(0, 2)
    .map((exp) => {
      const role = exp.position || 'professional role';
      const company = exp.company ? ` at ${exp.company}` : '';
      const details = exp.responsibilities ? ` focused on ${exp.responsibilities.toLowerCase()}` : '';
      return `${role}${company}${details}`;
    })
    .join('; ');
}

function formatSkills(skills = []) {
  return skills.length ? skills.join(', ') : 'core professional skills';
}

export function buildFallbackSummary({ professionalTitle, experience = [], education = [], skills = [] }) {
  const title = professionalTitle || 'professional';
  const skillsText = formatSkills(skills);
  const experienceText = formatExperience(experience);
  const educationText = education?.length ? education[0]?.degree || education[0]?.course || 'formal training' : 'formal training';

  return `Results-driven ${title} with experience building practical solutions and supporting business goals. Skilled in ${skillsText}, with a strong foundation in ${experienceText}. Equipped with ${educationText} and a dependable, adaptable approach to delivering quality work.`;
}

export function buildFallbackCoverLetter({ company, position, personalInfo = {}, experience = [], skills = [] }) {
  const name = [personalInfo.first_name, personalInfo.last_name].filter(Boolean).join(' ') || 'the candidate';
  const title = personalInfo.professional_title || 'professional';
  const companyText = company || 'this organization';
  const positionText = position || 'this opportunity';
  const skillsText = formatSkills(skills);
  const experienceText = formatExperience(experience);

  return `${name} is excited to apply for the ${positionText} role at ${companyText}. With a background as a ${title} and experience in ${experienceText}, ${name === 'the candidate' ? 'the candidate' : 'they'} brings a thoughtful, practical approach to solving problems and contributing to team success.\n\n${name === 'the candidate' ? 'The candidate' : 'They'} is particularly interested in helping ${companyText} grow by bringing strong ${skillsText} and a collaborative mindset to the role. The experience and training reflected in the resume support a reliable, adaptable contribution from the start.\n\n${name === 'the candidate' ? 'The candidate' : 'They'} would welcome the opportunity to discuss how these strengths can support the needs of ${companyText} and add value to the team.`;
}
