'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Case {
  id: string;
  companyName: string;
  domain: string;
  status: string;
  createdAt: string;
  incidentDate: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch user's cases
    fetch('/api/cases', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.cases) {
          setCases(data.cases);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load cases:', err);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'verified': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'scheduled_for_podcast': 'bg-purple-100 text-purple-800',
      'published': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Cases</h2>
            <p className="text-gray-600 mt-2">Track the status of your submitted cases</p>
          </div>
          <a
            href="/submit-case"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            + Submit New Case
          </a>
        </div>

        {cases.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cases Yet</h3>
            <p className="text-gray-600 mb-6">You haven&apos;t submitted any cases yet.</p>
            <a
              href="/submit-case"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Submit Your First Case
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {cases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {caseItem.companyName}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Domain:</span> {caseItem.domain}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Incident Date:</span>{' '}
                        {new Date(caseItem.incidentDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Submitted:</span>{' '}
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="ml-6 flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseItem.status)}`}>
                      {formatStatus(caseItem.status)}
                    </span>
                    <a
                      href={`/case/${caseItem.id}`}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
