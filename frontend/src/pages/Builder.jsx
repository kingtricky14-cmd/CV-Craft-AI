import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TemplateSelector from '../components/builder/TemplateSelector';
import PersonalInfoSection from '../components/builder/PersonalInfoSection';
import ExperienceSection from '../components/builder/ExperienceSection';
import EducationSection from '../components/builder/EducationSection';
import SkillsSection from '../components/builder/SkillsSection';
import LanguagesSection from '../components/builder/LanguagesSection';
import CertificationsSection from '../components/builder/CertificationsSection';
import ProjectsSection from '../components/builder/ProjectsSection';
import ReferencesSection from '../components/builder/ReferencesSection';
import ResumePreview from '../components/preview/ResumePreview';
import { api } from '../lib/api';
import { downloadResumeAsPdf, slugifyFilename } from '../lib/pdf';
import { generateSummary } from '../lib/ai';

const emptyPersonalInfo = {
  first_name: '',
  last_name: '',
  professional_title: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  linkedin: '',
  github: '',
  portfolio: '',
  summary: '',
  photo_url: null,
};

export default function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const [title, setTitle] = useState('Untitled Resume');
  const [template, setTemplate] = useState('classic');
  const [personalInfo, setPersonalInfo] = useState(emptyPersonalInfo);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [references, setReferences] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await api.get(`/resumes/${id}`);
        if (cancelled) return;

        setTitle(data.resume.title || 'Untitled Resume');
        setTemplate(data.resume.template || 'classic');
        setPersonalInfo({ ...emptyPersonalInfo, ...(data.personalInfo || {}) });
        setExperience(data.experience || []);
        setEducation(data.education || []);
        setSkills((data.skills || []).map((s) => s.skill));
        setLanguages(data.languages || []);
        setCertifications(data.certifications || []);
        setProjects(data.projects || []);
        setReferences(data.references || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveMessage('');
    setError('');
    try {
      await api.patch(`/resumes/${id}`, {
        title,
        template,
        personalInfo,
        experience: experience.map(({ _key, id: rowId, ...rest }) => rest),
        education: education.map(({ _key, id: rowId, ...rest }) => rest),
        skills: skills.map((skill) => ({ skill })),
        languages: languages.map(({ _key, id: rowId, ...rest }) => rest),
        certifications: certifications.map(({ _key, id: rowId, ...rest }) => rest),
        projects: projects.map(({ _key, id: rowId, ...rest }) => rest),
        references: references.map(({ _key, id: rowId, ...rest }) => rest),
      });
      setSaveMessage('Saved.');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [id, title, template, personalInfo, experience, education, skills, languages, certifications, projects, references]);

  const handleDownloadPdf = useCallback(async () => {
    setDownloading(true);
    setDownloadError('');
    try {
      await downloadResumeAsPdf('resume-preview-sheet', slugifyFilename(title));
    } catch (err) {
      setDownloadError(err.message);
    } finally {
      setDownloading(false);
    }
  }, [title]);

  const handleGenerateSummary = useCallback(async () => {
    setGeneratingSummary(true);
    setError('');
    try {
      const { summary } = await generateSummary({
        professionalTitle: personalInfo.professional_title,
        experience: experience.map(({ _key, id: rowId, ...rest }) => rest),
        education: education.map(({ _key, id: rowId, ...rest }) => rest),
        skills,
      });
      setPersonalInfo((prev) => ({ ...prev, summary }));
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingSummary(false);
    }
  }, [personalInfo.professional_title, experience, education, skills]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="p-8 text-center text-gray-500">Loading resume...</p>
      </div>
    );
  }

  const previewData = { personalInfo, experience, education, skills, languages, certifications, projects, references };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="border-b bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
              ← Dashboard
            </Link>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-64"
              placeholder="Resume title"
            />
          </div>

          <div className="flex items-center gap-3">
            <TemplateSelector value={template} onChange={setTemplate} />
            {saveMessage && <span className="text-sm text-green-600">{saveMessage}</span>}
            <Button variant="secondary" onClick={handleDownloadPdf} disabled={downloading}>
              {downloading ? 'Generating PDF...' : 'Download PDF'}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {(error || downloadError) && (
        <div className="mx-auto mt-4 max-w-7xl px-6">
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error || downloadError}</p>
        </div>
      )}

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-2">
        <div className="space-y-5">
          <PersonalInfoSection
            data={personalInfo}
            onChange={setPersonalInfo}
            onGenerateSummary={handleGenerateSummary}
            generatingSummary={generatingSummary}
          />
          <ExperienceSection items={experience} onChange={setExperience} />
          <EducationSection items={education} onChange={setEducation} />
          <SkillsSection skills={skills} onChange={setSkills} />
          <LanguagesSection items={languages} onChange={setLanguages} />
          <CertificationsSection items={certifications} onChange={setCertifications} />
          <ProjectsSection items={projects} onChange={setProjects} />
          <ReferencesSection items={references} onChange={setReferences} />

          <div className="flex justify-end pb-6">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <ResumePreview template={template} data={previewData} />
        </div>
      </main>
    </div>
  );
}
