import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import { api } from '../lib/api';

export default function CoverLetters() {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .get('/cover-letters')
      .then(({ coverLetters }) => {
        if (!cancelled) setLetters(coverLetters);
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
  }, []);

  const handleCreate = async () => {
    const { coverLetter } = await api.post('/cover-letters', {});
    navigate(`/cover-letters/${coverLetter.id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this cover letter? You can't undo this.")) return;
    const previous = letters;
    setLetters((prev) => prev.filter((l) => l.id !== id));
    try {
      await api.delete(`/cover-letters/${id}`);
    } catch (err) {
      setLetters(previous);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cover letters</h1>
            <p className="mt-1 text-sm text-gray-500">
              Write a tailored cover letter for each application.
            </p>
          </div>
          <Button onClick={handleCreate}>+ New cover letter</Button>
        </div>

        <div className="mt-6">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {!loading && letters.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No cover letters yet. Create your first one.
            </div>
          )}

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {letters.map((letter) => (
              <li
                key={letter.id}
                onClick={() => navigate(`/cover-letters/${letter.id}`)}
                className="cursor-pointer rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <p className="truncate font-semibold text-gray-900">
                  {letter.position || 'Untitled position'}
                  {letter.company ? ` — ${letter.company}` : ''}
                </p>
                {letter.hiring_manager && (
                  <p className="mt-1 text-xs text-gray-400">Attn: {letter.hiring_manager}</p>
                )}
                <p className="mt-3 text-xs text-gray-400">
                  Updated {new Date(letter.updated_at).toLocaleDateString()}
                </p>

                <div className="mt-3 border-t pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(letter.id);
                    }}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
