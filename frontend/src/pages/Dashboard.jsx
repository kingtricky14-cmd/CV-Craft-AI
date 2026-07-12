import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import ResumeCard from '../components/dashboard/ResumeCard';
import { api } from '../lib/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResumes = async (query = '') => {
    setLoading(true);
    try {
      const { resumes } = await api.get(`/resumes${query ? `?search=${encodeURIComponent(query)}` : ''}`);
      setResumes(resumes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadResumes(search);
  };

  const handleCreate = async () => {
    const { resume } = await api.post('/resumes', { title: 'Untitled Resume', template: 'classic' });
    navigate(`/builder/${resume.id}`);
  };

  const handleRename = async (resumeId, newTitle) => {
    // Optimistic update so the UI feels instant; roll back on failure.
    const previous = resumes;
    setResumes((prev) => prev.map((r) => (r.id === resumeId ? { ...r, title: newTitle } : r)));
    try {
      await api.patch(`/resumes/${resumeId}`, { title: newTitle });
    } catch (err) {
      setResumes(previous);
      setError(err.message);
    }
  };

  const handleDuplicate = async (resumeId) => {
    setError('');
    try {
      const { resume } = await api.post(`/resumes/${resumeId}/duplicate`);
      setResumes((prev) => [resume, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (resumeId) => {
    const confirmed = window.confirm('Delete this resume? You can\'t undo this from the app.');
    if (!confirmed) return;

    const previous = resumes;
    setResumes((prev) => prev.filter((r) => r.id !== resumeId));
    try {
      await api.delete(`/resumes/${resumeId}`);
    } catch (err) {
      setResumes(previous);
      setError(err.message);
    }
  };

  const lastEdited = resumes[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Your resumes</h1>
          <Button onClick={handleCreate}>+ Create new resume</Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total resumes</p>
            <p className="text-2xl font-bold">{resumes.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Last edited</p>
            <p className="text-2xl font-bold">{lastEdited ? lastEdited.title : '—'}</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-8 flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resumes..."
            className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <div className="mt-6">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {!loading && resumes.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No resumes yet. Create your first one to get started.
            </div>
          )}

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onOpen={(id) => navigate(`/builder/${id}`)}
                onRename={handleRename}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
