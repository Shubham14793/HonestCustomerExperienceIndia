'use client';

import { useEffect, useState } from 'react';

interface YouTubeConfig {
  channelUrl: string;
  featuredVideoId: string;
}

export default function HomePage() {
  const [config, setConfig] = useState<YouTubeConfig | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Honest Customer Experience India
            </h1>
            <div className="space-x-4">
              <a
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                Login
              </a>
              <a
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Submit Your Case
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Genuine Customer Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help others make informed decisions by sharing your authentic experiences with businesses.
            We verify every case and create awareness through our YouTube channel.
          </p>
        </div>

        {/* YouTube Featured Video */}
        {config?.featuredVideoId && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${config.featuredVideoId}`}
                title="Featured Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
            {config.channelUrl && (
              <div className="text-center mt-6">
                <a
                  href={config.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Visit Our YouTube Channel
                </a>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Submit Your Case</h3>
            <p className="text-gray-600">
              Share your detailed experience with businesses where you faced genuine issues and losses.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">We Verify</h3>
            <p className="text-gray-600">
              Our team thoroughly verifies all details to ensure authenticity and accuracy.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold mb-2">Podcast Coverage</h3>
            <p className="text-gray-600">
              Verified cases are featured in our YouTube podcasts to create awareness.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Share Your Experience?
          </h3>
          <ul className="space-y-4 max-w-2xl mx-auto">
            <li className="flex items-start">
              <span className="text-blue-600 mr-3">•</span>
              <span className="text-gray-700">Help others avoid similar bad experiences</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3">•</span>
              <span className="text-gray-700">Hold businesses accountable for poor service</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3">•</span>
              <span className="text-gray-700">Create awareness through public platforms</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3">•</span>
              <span className="text-gray-700">Track the progress of your case submission</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Honest Customer Experience India</h3>
            <p className="text-gray-400 mb-4">
              Empowering customers to share genuine experiences and make informed decisions
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 Honest Customer Experience India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
