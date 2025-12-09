// src/pages/Analysis/HairReport.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAnalysis, updateAnalysis } from '../../data/analysesStorage';
import { generateReport } from '../../utils/reportGenerator';
import Gauge from '../../components/Charts/Gauge';
import RadarChart from '../../components/Charts/RadarChart';
import SmallBar from '../../components/Charts/SmallBar';
import PieChart from '../../components/Charts/PieChart';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const defaultColors = ['#4f46e5', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];
const nutrientPalette = ['#4f46e5','#06b6d4','#f59e0b','#ef4444','#10b981'];

const HairReport = () => {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [report, setReport] = useState(null);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const containerRef = useRef();

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

    if (!analysis || !report) return <div className="p-6">Report loading…</div>;

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

    // Compose metrics for visuals (ensure values exist, default gracefully)
    const density = Number(report.metrics.hair_density.value ?? 0);
    const thickness = Number(report.metrics.hair_thickness.value ?? 0);
    const damage = Number(report.metrics.damage_level.value ?? 0);
    const scalp = Number(report.metrics.scalp_condition.value ?? 0);
    const hairType = report.metrics.hair_type.interpretation || '—';

    // Radar uses same set but rebalanced into 0..100
    const radarData = [
        { label: 'Density', value: density },
        { label: 'Thickness', value: thickness },
        { label: 'Damage (inv)', value: Math.max(0, 100 - damage) }, // invert damage for "health"
        { label: 'Scalp', value: scalp }
    ];

    const overallHealth = Math.round((density + thickness + (100 - damage) + scalp) / 4);

    const downloadPDF = async () => {
        const el = containerRef.current;
        if (!el) return;
        const canvas = await html2canvas(el, { scale: 2, useCORS: true });
        const img = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        const w = pdf.internal.pageSize.getWidth() - 40;
        const h = (canvas.height * w) / canvas.width;
        pdf.addImage(img, 'PNG', 20, 20, w, h);
        pdf.setTextColor(200);
        pdf.setFontSize(40);
        pdf.text('YourBrand', pdf.internal.pageSize.getWidth() - 160, pdf.internal.pageSize.getHeight() - 40, { angle: -30, align: 'left', opacity: 0.12 });
        pdf.save(`${analysis.testId}_hair_report.pdf`);
    };

    const saveNotes = async () => {
        setSaving(true);
        updateAnalysis(analysis.testId, { clinicianNotes: notes });
        setAnalysis(prev => ({ ...prev, clinicianNotes: notes }));
        setSaving(false);
        alert('Notes saved.');
    };

    return (
        <div className="p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Hair Report — {analysis.testId}</h1>
                    <div className="text-sm text-gray-600">Customer: {analysis.customerSnapshot?.name || 'Guest'}</div>
                    <div className="mt-2 text-sm text-gray-500">{report.hair_loss?.causes?.slice(0, 3).join('; ')}</div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/analysis/history')} className="px-3 py-2 border rounded">Back to History</button>
                    <button onClick={downloadPDF} className="px-4 py-2 bg-blue-600 text-white rounded">Download PDF</button>
                    {/* <button onClick={() => alert('Email sending requires backend. Placeholder.')} className="px-4 py-2 border rounded">Email Report</button> */}
                </div>
            </div>

            <div ref={containerRef} className="bg-white rounded shadow p-6">
                {/* Top KPI / Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-center">
                    <div className="md:col-span-2">
                        <div className="flex gap-4">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div className="p-4 border rounded bg-gray-50">
                                    <div className="text-xs text-gray-500">Overall hair health</div>
                                    <div className="text-2xl font-semibold">{overallHealth} / 100</div>
                                    <div className="text-sm text-gray-600 mt-2">Combined density, thickness, damage & scalp health</div>
                                </div>

                                <div className="p-4 border rounded bg-gray-50">
                                    <div className="text-xs text-gray-500">Hair type</div>
                                    <div className="text-2xl font-semibold mt-1">{hairType}</div>
                                    <div className="text-sm text-gray-600 mt-2">Useful for product tailoring</div>
                                </div>

                                <div className="p-4 border rounded bg-gray-50">
                                    <div className="text-xs text-gray-500">Loss risk</div>
                                    <div className="text-2xl font-semibold mt-1">{report.hair_loss.lossRisk} / 100</div>
                                    <div className="text-sm text-gray-600 mt-2">Higher score indicates greater concern</div>
                                </div>

                                <div className="p-4 border rounded bg-gray-50">
                                    <div className="text-xs text-gray-500">Confidence</div>
                                    <div className="text-2xl font-semibold mt-1">{Math.min(100, Math.max(40, Math.round(overallHealth * 0.9)))}%</div>
                                    <div className="text-sm text-gray-600 mt-2">Algorithmic confidence (heuristic)</div>
                                </div>
                            </div>

                            <div className="w-56 flex flex-col items-center justify-center p-4 border rounded bg-white">
                                <Gauge value={overallHealth} size={140} thickness={16} color="#06b6d4" />
                                <div className="text-xs text-gray-500 mt-2">Health score</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border rounded">
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

                {/* Charts section */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-2 p-4 border rounded">
                        <h4 className="font-semibold mb-3">Multi-metric view</h4>
                        <div className="flex items-center gap-6">
                            <div className="w-1/2">
                                <RadarChart data={radarData} size={260} />
                            </div>
                            <div className="flex-1 space-y-4">
                                <SmallBar label="Hair Density" value={density} color="#4f46e5" />
                                <SmallBar label="Hair Thickness" value={thickness} color="#06b6d4" />
                                <SmallBar label="Damage (lower is better)" value={Math.max(0, 100 - damage)} color="#f59e0b" />
                                <SmallBar label="Scalp condition" value={scalp} color="#10b981" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border rounded">
                        <h4 className="font-semibold mb-3">Quick actions</h4>
                        <ol className="list-decimal ml-5 text-sm text-gray-700">
                            {report.recommendations.slice(0, 4).map((r, i) => <li key={i}>{r}</li>)}
                        </ol>
                        <div className="mt-4">
                            <strong className="text-sm">Suggested blood tests</strong>
                            <ul className="list-disc ml-5 text-sm mt-2">
                                {report.bloodTests.slice(0, 6).map(t => <li key={t}>{t}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
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

                {/* Detailed metrics + report */}
                {/* <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border rounded">
            <h4 className="font-semibold mb-3">Detailed metrics & interpretation</h4>
            <div className="space-y-4">
              {Object.entries(report.metrics).map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium capitalize">{k.replace('_',' ')}</div>
                      <div className="text-xs text-gray-500">{v.interpretation.description}</div>
                    </div>
                    <div style={{ width: 160 }}>
                      <SmallBar label="" value={k === 'damage_level' ? Math.max(0, 100 - v.value) : v.value} color={k === 'damage_level' ? '#f59e0b' : '#4f46e5'} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-semibold mb-3">Hair Loss & symptoms</h4>
            <div className="text-sm text-gray-700 mb-3">
              <div><strong>Loss risk:</strong> {report.hair_loss.lossRisk} / 100</div>
              <div className="mt-2"><strong>Likely causes:</strong>
                <ul className="list-disc ml-5">
                  {report.hair_loss.causes.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>

            <div>
              <strong className="text-sm">Submitted symptoms</strong>
              <div className="text-xs text-gray-600 mt-2">{JSON.stringify(analysis.answers || {})}</div>
            </div>
          </div>
        </div> */}

                {/* Recommendations and notes */}
                {/* <div className="mb-6">
          <h4 className="font-semibold mb-3">Full recommendations</h4>
          <ol className="list-decimal ml-5 text-sm">
            {report.recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ol>
        </div> */}

                {/* <div className="mb-6">
          <h4 className="font-semibold mb-3">Suggested blood tests (full list)</h4>
          <ul className="list-disc ml-5 text-sm">
            {report.bloodTests.map(t => <li key={t}>{t}</li>)}
          </ul>
        </div> */}

                <div className="mb-6">
                    <h4 className="font-semibold mb-3">Clinician notes</h4>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className="w-full p-3 border rounded" />
                    <div className="mt-3 flex gap-2">
                        <button onClick={saveNotes} className="px-4 py-2 bg-green-600 text-white rounded">{saving ? 'Saving...' : 'Save Notes'}</button>
                        <button onClick={() => { setNotes(analysis.clinicianNotes || ''); }} className="px-4 py-2 border rounded">Reset</button>
                    </div>
                </div>

                <div className="text-xs text-gray-400">Report generated at: {report.generatedAt}</div>
            </div>
        </div>
    );
};

export default HairReport;
