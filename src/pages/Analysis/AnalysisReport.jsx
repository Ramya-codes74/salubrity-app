// src/pages/Analysis/AnalysisReport.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchAnalysis, updateAnalysis } from '../../data/analysesStorage';
import { generateReport } from '../../utils/reportGenerator';
import PieChart from '../../components/Charts/PieChart';
import BarChart from '../../components/Charts/BarChart';

const nutrientPalette = ['#4f46e5','#06b6d4','#f59e0b','#ef4444','#10b981'];

const LABELS = {
  hairImageChoice: 'Hair image',
  familyHistory: 'Family history',
  dandruff: 'Dandruff',
  sleep: 'Sleep quality',
  stress: 'Stress (1-10)',
  gastric: 'Gastric issues?',
  gastricDetails: 'Gastric details',
  energy: 'Energy (1-10)',
  medication: 'Medication?',
  medicationDetails: 'Medications',
  scalpImage: 'Scalp image'
};

const AnalysisReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [report, setReport] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const a = fetchAnalysis(id);
    if (!a) return;
    setAnalysis(a);
    if (a.report) setReport(a.report);
    else {
      const gen = generateReport(a);
      setReport(gen);
      updateAnalysis(id, { report: gen });
    }
    setNotes(a.clinicianNotes || '');
  }, [id]);

  if (!analysis || !report) return <div className="p-6">Loading report...</div>;

  // scalp image display
  const scalpImage = analysis.scalpImageBase64 || analysis.answers?.scalpImage || null;

  // Nutrition sample: build pie data (if tags exist show them; else sample breakdown)
  let nutritionData = [];
  if (report.nutrition && report.nutrition.tags && report.nutrition.tags.length) {
    nutritionData = report.nutrition.tags.map((t, i) => ({ label: t, value: 1, color: nutrientPalette[i % nutrientPalette.length] }));
  } else {
    // sample breakdown (macros & vitamins)
    nutritionData = [
      { label: 'Protein & Amino acids', value: 30, color: nutrientPalette[0] },
      { label: 'Iron & Micronutrients', value: 25, color: nutrientPalette[1] },
      { label: 'Omega-3 & Fats', value: 15, color: nutrientPalette[2] },
      { label: 'Vitamins (D/B12)', value: 20, color: nutrientPalette[3] },
      { label: 'Other (Zinc/selenium)', value: 10, color: nutrientPalette[4] }
    ];
  }

  // formatted submitted symptoms list
  const symptoms = analysis.answers || {};

  // actor info: check if analysis record indicates actor; fallback to "Self"
  const actor = analysis.actor || (analysis.createdByEmployee ? 'Employee' : 'Self');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hair Report — {analysis.testId}</h1>
          <div className="text-sm text-gray-500">Customer: {analysis.customerSnapshot?.name || 'Guest'}</div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => navigate('/analysis/history')} className="px-3 py-2 border rounded">Back to History</button>
          <button onClick={() => { /* download/email handled elsewhere */ }} className="px-3 py-2 bg-blue-600 text-white rounded">Download PDF</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-sm text-gray-600">{(report.hair_loss?.causes?.length ? report.hair_loss.causes.join('; ') + '. ' : '') + (report.recommendations?.slice(0,3).join('. ') || '')}</p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Hair Density</div>
              <div className="text-lg font-semibold">{report.metrics.hair_density.value}</div>
              <div className="text-xs text-gray-500">{report.metrics.hair_density.interpretation.label}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Hair Thickness</div>
              <div className="text-lg font-semibold">{report.metrics.hair_thickness.value}</div>
              <div className="text-xs text-gray-500">{report.metrics.hair_thickness.interpretation.label}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Damage Level</div>
              <div className="text-lg font-semibold">{report.metrics.damage_level.value}</div>
              <div className="text-xs text-gray-500">{report.metrics.damage_level.interpretation.label}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Scalp condition</div>
              <div className="text-lg font-semibold">{report.metrics.scalp_condition.value}</div>
              <div className="text-xs text-gray-500">{report.metrics.scalp_condition.interpretation.label}</div>
            </div>
          </div>

          {/* Scalp image */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Uploaded Scalp Image</h4>
            {scalpImage ? (
              <img src={scalpImage} alt="scalp upload" className="w-64 h-64 object-cover rounded border" />
            ) : (
              <div className="text-sm text-gray-500">No scalp image available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded border">
          <h4 className="font-semibold mb-2">Nutrition Overview (sample)</h4>
          <div className="flex gap-3 items-center">
            <div style={{ width: 140 }}><PieChart data={nutritionData} size={140} /></div>
            <div>
              <div className="text-sm text-gray-700 mb-2">{report.nutrition.aiNarrative || 'Protein-rich diet recommended; emphasis on iron, vitamin D and B12 for hair strength.'}</div>
              <div className="text-sm text-gray-600">Top nutrients to support hair:</div>
              <ul className="list-disc ml-5 text-sm mt-2">
                <li>Protein & amino acids (keratin precursors)</li>
                <li>Iron / ferritin — for hair growth</li>
                <li>Vitamin D & B12 — energy & follicle health</li>
                <li>Zinc — scalp & hair shaft integrity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Structured submitted symptoms */}
      <div className="bg-white p-4 rounded border mb-6">
        <h3 className="font-semibold mb-2">Submitted symptoms & questionnaire</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.keys(symptoms).length === 0 && <div className="text-sm text-gray-500">No responses found.</div>}
          {Object.entries(symptoms).map(([k, v]) => {
            if (k === 'scalpImage') return null; // already shown
            const label = LABELS[k] || k;
            return (
              <div key={k} className="p-2 border rounded">
                <div className="text-xs text-gray-500">{label}</div>
                <div className="font-medium">{String(v || '—')}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations & blood tests */}
      <div className="bg-white p-4 rounded border mb-6">
        <h3 className="font-semibold">Recommendations</h3>
        <ol className="list-decimal ml-5 text-sm mt-2">
          {report.recommendations.map((r, i) => <li key={i}>{r}</li>)}
        </ol>

        <div className="mt-4">
          <h4 className="font-semibold">Suggested blood tests</h4>
          <ul className="list-disc ml-5 text-sm mt-2">
            {report.bloodTests.map(t => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded border mb-6">
        <h3 className="font-semibold">Details</h3>
        <div className="text-sm text-gray-600 mt-2">
          <div><strong>Test ID:</strong> {analysis.testId}</div>
          <div><strong>Created:</strong> {new Date(analysis.createdAt).toLocaleString()}</div>
          <div><strong>Performed by:</strong> {actor}</div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
