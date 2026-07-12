import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function Navbar() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-lg font-bold text-brand-600">
          CVCraft AI
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/dashboard" className="text-gray-600 hover:text-brand-600">
            Resumes
          </Link>
          <Link to="/cover-letters" className="text-gray-600 hover:text-brand-600">
            Cover letters
          </Link>
          <Link to="/settings" className="text-gray-600 hover:text-brand-600">
            Settings
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{user?.email}</span>
        <Button variant="ghost" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
