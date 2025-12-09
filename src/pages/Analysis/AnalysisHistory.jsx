// src/pages/Analysis/AnalysisHistory.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadAnalyses } from '../../data/analysesStorage';
import SlidePanel from '../../shared/SlidePanel';

const PAGE_SIZES = [5, 10, 20];

const AnalysisHistory = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setAnalyses(loadAnalyses());
  }, []);

  useEffect(() => {
    // reload on storage change (optional)
    const onStorage = (e) => {
      if (e.key && e.key.startsWith('analyses')) setAnalyses(loadAnalyses());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const filtered = useMemo(() => {
    let list = analyses.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(a => [a.testId, a.customerSnapshot?.name, a.customerSnapshot?.email].join(' ').toLowerCase().includes(q));
    }
    if (statusFilter) list = list.filter(a => a.status === statusFilter);
    if (actorFilter) {
      if (actorFilter === 'Self') list = list.filter(a => !a.createdByEmployee);
      if (actorFilter === 'Employee') list = list.filter(a => !!a.createdByEmployee);
    }
    // sort by createdAt desc
    list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [analyses, query, statusFilter, actorFilter]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analysis History</h1>
          <p className="text-sm text-gray-500">All analyses performed</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(true)} className="px-3 py-2 border rounded">Filters</button>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-3 py-2 border rounded">
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded border">
        <div className="p-4 border-b flex items-center gap-3">
          <input placeholder="Search by test id, customer or email" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="flex-1 p-2 border rounded" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Test</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Date / Time</th>
                <th className="px-4 py-3 text-left">Performed by</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map(a => (
                <tr key={a.testId} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/analysis/report/${a.testId}`)}>
                  <td className="px-4 py-3">{a.testId}</td>
                  <td className="px-4 py-3">{a.customerSnapshot?.name || 'Guest'}<div className="text-xs text-gray-500">{a.customerSnapshot?.email}</div></td>
                  <td className="px-4 py-3">{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{a.createdByEmployee ? `${a.createdByEmployeeName || 'Employee'}` : 'Self'}</td>
                  <td className="px-4 py-3">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing <strong>{pageItems.length}</strong> of <strong>{total}</strong></div>
          <div className="flex items-center gap-2">
            <button disabled={page===1} onClick={() => setPage(p => Math.max(1,p-1))} className="px-3 py-2 border rounded">Prev</button>
            <div className="px-3 py-2 border rounded text-sm">Page {page} of {pages}</div>
            <button disabled={page===pages} onClick={() => setPage(p => Math.min(pages,p+1))} className="px-3 py-2 border rounded">Next</button>
          </div>
        </div>
      </div>

      <SlidePanel open={showFilters} onClose={() => setShowFilters(false)}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 border rounded">
                <option value=''>Any</option>
                <option>Pending</option>
                <option>Complete</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Performed by</label>
              <select value={actorFilter} onChange={(e) => setActorFilter(e.target.value)} className="w-full p-2 border rounded">
                <option value=''>Any</option>
                <option value='Self'>Self</option>
                <option value='Employee'>Employee</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { setStatusFilter(''); setActorFilter(''); }} className="px-4 py-2 border rounded">Reset</button>
              <button onClick={() => setShowFilters(false)} className="px-4 py-2 bg-blue-600 text-white rounded">Apply</button>
            </div>
          </div>
        </div>
      </SlidePanel>
    </div>
  );
};

export default AnalysisHistory;
