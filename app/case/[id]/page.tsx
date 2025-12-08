'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CaseDetail {
  id: string;
  companyName: string;
  domain: string;
  incidentDate: string;
  description: string;
  lossTypes: string[];
  monetaryLoss?: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  podcastVideoUrl?: string;
  rejectionReason?: string;
}

interface Update {
  id: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`/api/cases/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.case) {
          setCaseData(data.case);
          setUpdates(data.updates || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load case:', err);
        setLoading(false);
      });
  }, [id, router]);

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

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Not Found</h2>
          <a href="/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <a href="/dashboard" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← Back to Dashboard
        </a>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {caseData.companyName}
                </h1>
                <p className="text-gray-600">{caseData.domain}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(caseData.status)}`}>
                {formatStatus(caseData.status)}
              </span>
            </div>
          </div>

          {/* Case Details */}
          <div className="px-6 py-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Incident Date</h3>
              <p className="text-gray-900">{new Date(caseData.incidentDate).toLocaleDateString()}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{caseData.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Loss Types</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {caseData.lossTypes.map((type) => (
                  <span key={type} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {caseData.monetaryLoss && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Monetary Loss</h3>
                <p className="text-gray-900 font-semibold">₹{caseData.monetaryLoss.toLocaleString()}</p>
              </div>
            )}

            {caseData.status === 'rejected' && caseData.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-red-800 mb-1">Rejection Reason</h3>
                <p className="text-red-700">{caseData.rejectionReason}</p>
              </div>
            )}

            {caseData.podcastVideoUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Podcast Video</h3>
                <a
                  href={caseData.podcastVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Watch Podcast Video
                </a>
              </div>
            )}
          </div>

          {/* Updates Timeline */}
          {updates.length > 0 && (
            <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Updates & Timeline</h3>
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="flex">
                    <div className="flex-shrink-0 w-2 bg-blue-600 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <p className="text-gray-900">{update.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(update.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-medium">Name:</span> {caseData.contactName}</p>
              <p className="text-gray-700"><span className="font-medium">Email:</span> {caseData.contactEmail}</p>
              <p className="text-gray-700"><span className="font-medium">Phone:</span> {caseData.contactPhone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
