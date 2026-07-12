import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-bold text-brand-600">CVCraft AI</span>
        <nav className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/register">
            <Button>Get started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Build professional resumes and cover letters in minutes.
        </h1>
        <p className="mt-4 max-w-xl text-gray-600">
          ATS-friendly templates, live preview, and one-click PDF export — no design experience
          needed.
        </p>
        <Link to="/register" className="mt-8">
          <Button className="px-6 py-3 text-base">Create your resume — it's free</Button>
        </Link>
      </main>
    </div>
  );
}
