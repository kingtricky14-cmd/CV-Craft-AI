import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { api } from '../lib/api';

export default function Settings() {
  const { user, signOut, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Delete account
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    setProfileError('');
    try {
      await api.patch('/auth/me', { firstName, lastName });
      await refreshProfile();
      setProfileMessage('Profile updated.');
      setTimeout(() => setProfileMessage(''), 2000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      // Password changes go straight through Supabase Auth on the client —
      // it already has the user's session, no need to route via our backend.
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPasswordMessage('Password updated.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 2000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    setDeleting(true);
    try {
      await api.delete('/auth/me');
      await signOut();
      navigate('/');
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-2xl space-y-6 px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <Card title="Profile">
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <Input label="Email" value={user?.email || ''} disabled />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {profileError && <p className="text-sm text-red-500">{profileError}</p>}
            {profileMessage && <p className="text-sm text-green-600">{profileMessage}</p>}

            <Button type="submit" disabled={profileSaving}>
              {profileSaving ? 'Saving...' : 'Save profile'}
            </Button>
          </form>
        </Card>

        <Card title="Change password">
          <form onSubmit={handleChangePassword} className="space-y-3">
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            {passwordMessage && <p className="text-sm text-green-600">{passwordMessage}</p>}

            <Button type="submit" disabled={passwordSaving}>
              {passwordSaving ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        </Card>

        <Card title="Delete account" description="This permanently deletes your account and all your resumes and cover letters. This cannot be undone.">
          <div className="space-y-3">
            <Input
              label={'Type "DELETE" to confirm'}
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />

            {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}

            <button
              type="button"
              disabled={deleteConfirmText !== 'DELETE' || deleting}
              onClick={handleDeleteAccount}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Permanently delete my account'}
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}
