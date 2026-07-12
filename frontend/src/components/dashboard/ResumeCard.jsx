import { useState } from 'react';

export default function ResumeCard({ resume, onOpen, onRename, onDuplicate, onDelete }) {
  const [renaming, setRenaming] = useState(false);
  const [draftTitle, setDraftTitle] = useState(resume.title);

  const startRename = (e) => {
    e.stopPropagation();
    setDraftTitle(resume.title);
    setRenaming(true);
  };

  const commitRename = () => {
    const trimmed = draftTitle.trim();
    setRenaming(false);
    if (trimmed && trimmed !== resume.title) {
      onRename(resume.id, trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitRename();
    } else if (e.key === 'Escape') {
      setDraftTitle(resume.title);
      setRenaming(false);
    }
  };

  return (
    <li
      onClick={() => !renaming && onOpen(resume.id)}
      className="cursor-pointer rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      {renaming ? (
        <input
          autoFocus
          value={draftTitle}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setDraftTitle(e.target.value)}
          onBlur={commitRename}
          onKeyDown={handleKeyDown}
          className="w-full rounded border border-brand-300 px-2 py-1 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500/40"
        />
      ) : (
        <p className="truncate font-semibold text-gray-900">{resume.title}</p>
      )}

      <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">{resume.template}</p>
      <p className="mt-3 text-xs text-gray-400">
        Updated {new Date(resume.updated_at).toLocaleDateString()}
      </p>

      <div className="mt-3 flex items-center gap-1 border-t pt-2 text-xs">
        <button
          type="button"
          onClick={startRename}
          className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          Rename
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(resume.id);
          }}
          className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          Duplicate
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(resume.id);
          }}
          className="rounded px-2 py-1 text-red-500 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
