import React, { useState } from 'react';
import { createPackage } from './services/packageService';

export default function App() {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const savedPackage = await createPackage({ name, version });
      setStatus({ type: 'success', message: `Created package ${savedPackage.name}@${savedPackage.version}` });
      setName('');
      setVersion('');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold">Package Manager</h1>
        <p className="mt-4 text-slate-600">Submit a new package to the backend.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700">Package Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-2 focus:border-slate-500 focus:outline-none"
              placeholder="example-package"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-2 focus:border-slate-500 focus:outline-none"
              placeholder="1.0.0"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Save Package'}
          </button>

          {status && (
            <p className={`mt-4 text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {status.message}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
