import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Card from '../components/ui/Card';
import { api } from '../lib/api';
import { downloadResumeAsPdf, slugifyFilename } from '../lib/pdf';
import { generateCoverLetterDraft } from '../lib/ai';

export default function CoverLetterEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [error, setError] = useState('');

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [letter, setLetter] = useState('');

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/cover-letters/${id}`)
      .then(({ coverLetter }) => {
        if (cancelled) return;
        setCompany(coverLetter.company || '');
        setPosition(coverLetter.position || '');
        setHiringManager(coverLetter.hiring_manager || '');
        setLetter(coverLetter.letter || '');
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError('');
    try {
      await api.patch(`/cover-letters/${id}`, {
        company,
        position,
        hiringManager,
        letter,
      });
      setSaveMessage('Saved.');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [id, company, position, hiringManager, letter]);

  const handleDownloadPdf = useCallback(async () => {
    setDownloading(true);
    setError('');
    try {
      await downloadResumeAsPdf('cover-letter-preview', slugifyFilename(`cover-letter-${company || 'draft'}`));
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  }, [company]);

  const handleGenerateLetter = useCallback(async () => {
    setGeneratingLetter(true);
    setError('');
    try {
      // Pull background info from the user's most recently edited resume (if
      // any) so the AI has real skills/experience to work with, instead of
      // making the user re-type everything here.
      let personalInfo = {};
      let experience = [];
      let skills = [];

      try {
        const { resumes } = await api.get('/resumes');
        if (resumes.length > 0) {
          const full = await api.get(`/resumes/${resumes[0].id}`);
          personalInfo = full.personalInfo || {};
          experience = full.experience || [];
          skills = (full.skills || []).map((s) => s.skill);
        }
      } catch {
        // No resume yet, or it failed to load — that's fine, the AI will
        // just write a more general draft.
      }

      const { letter } = await generateCoverLetterDraft({
        company,
        position,
        hiringManager,
        personalInfo,
        experience,
        skills,
      });
      setLetter(letter);
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingLetter(false);
    }
  }, [company, position, hiringManager]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="p-8 text-center text-gray-500">Loading cover letter...</p>
      </div>
    );
  }

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const todayFormatted = `${day}/${month}/${year}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="border-b bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link to="/cover-letters" className="text-sm text-gray-400 hover:text-gray-600">
            ← Cover letters
          </Link>
          <div className="flex items-center gap-3">
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

      {error && (
        <div className="mx-auto mt-4 max-w-7xl px-6">
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        </div>
      )}

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-2">
        <div className="space-y-5">
          <Card title="Details">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <Input
                label="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <Input
                label="Hiring manager"
                value={hiringManager}
                onChange={(e) => setHiringManager(e.target.value)}
                className="sm:col-span-2"
                placeholder="Leave blank for 'Hiring Manager'"
              />
            </div>
          </Card>

          <Card
            title="Letter"
            action={
              <button
                type="button"
                onClick={handleGenerateLetter}
                disabled={generatingLetter}
                className="rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generatingLetter ? 'Generating...' : '✨ Generate with AI'}
              </button>
            }
          >
            <Textarea
              rows={16}
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              placeholder="Dear Hiring Manager,&#10;&#10;I'm excited to apply for... (or click Generate with AI above)"
            />
          </Card>

          <div className="flex justify-end pb-6">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex justify-center bg-gray-100 p-4">
            <div
              id="cover-letter-preview"
              className="min-h-[780px] w-full max-w-[600px] bg-white p-10 text-[11px] leading-relaxed text-gray-900 shadow-lg"
            >
              <p className="text-gray-500">{todayFormatted}</p>

              {company && <p className="mt-4 font-semibold">{company}</p>}

              <p className="mt-4">Dear {hiringManager || 'Hiring Manager'},</p>

              {position && (
                <p className="mt-2 text-gray-500">Re: Application for {position}</p>
              )}

              <p className="mt-4 whitespace-pre-line">
                {letter || 'Your cover letter will appear here as you type...'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
