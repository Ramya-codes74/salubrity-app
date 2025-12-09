// src/data/analysesStorage.js
// (Add/update this file — merge with your existing version if needed)

const STORAGE_KEY = 'analyses_v1';

const seedIfNeeded = () => {
  if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
};

export const loadAnalyses = () => {
  try { seedIfNeeded(); return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { console.error(e); return []; }
};

export const saveAnalyses = (list) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { console.error(e); }
};

export const genTestId = (list = []) => {
  const nums = list.map(a => parseInt((a.testId || '').replace(/^T0*/, '') || 0, 10));
  const max = nums.length ? Math.max(...nums) : 0;
  const next = max + 1;
  return `T${String(next).padStart(4, '0')}`;
};

export const createAnalysis = ({ customerId, customerSnapshot, answers, scalpImageBase64 }) => {
  const all = loadAnalyses();
  const testId = genTestId(all);
  const record = {
    testId,
    customerId: customerId || null,
    customerSnapshot: customerSnapshot || null,
    answers,
    scalpImageBase64: scalpImageBase64 || null,
    status: 'Pending',
    report: null,
    clinicianNotes: '',
    createdAt: new Date().toISOString()
  };
  all.unshift(record);
  saveAnalyses(all);

  // Simulate processing and generate a report asynchronously
  setTimeout(() => {
    const updated = loadAnalyses().map(r => {
      if (r.testId !== testId) return r;
      // NOTE: move generateReport to utils and import it there in your real code
      const { generateReport } = require('../utils/reportGenerator'); // CommonJS dynamic import avoids circular in some bundlers
      const report = generateReport(r);
      return { ...r, status: 'Complete', report, completedAt: new Date().toISOString() };
    });
    saveAnalyses(updated);
  }, 2000);

  return record;
};

export const fetchAnalysis = (testId) => {
  const all = loadAnalyses();
  return all.find(a => a.testId === testId) || null;
};

export const updateAnalysis = (testId, patch) => {
  const all = loadAnalyses();
  const next = all.map(a => a.testId === testId ? { ...a, ...patch } : a);
  saveAnalyses(next);
  return next.find(a => a.testId === testId) || null;
};
