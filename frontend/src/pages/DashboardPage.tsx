import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import AuthGuard from '../components/AuthGuard';
import TabBar from '../components/TabBar';
import ProfileTab from '../components/ProfileTab';
import AdminTab from '../components/AdminTab';
import TokenTab from '../components/TokenTab';
import { fetchWithToken } from '../lib/apiClient';

const DashboardPage = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<'profile' | 'admin' | 'token'>('profile');
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user?.email ?? null);

      try {
        const profile = await fetchWithToken('/me/profile');
        setRole(profile.role);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">🎉 Welcome {email}</h2>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>

        <TabBar
          active={tab}
          onChange={setTab}
        />

        <div className="px-6 py-4">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'admin' && role !== 'member' && <AdminTab />}
          {tab === 'token' && <TokenTab />}
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;