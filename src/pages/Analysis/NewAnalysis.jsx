// src/pages/Analysis/NewAnalysis.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/ImageUploader';
import { createAnalysis } from '../../data/analysesStorage';
import customersData from '../../data/mockCustomers';

// Keep same QUESTIONS as before (use friendly keys)
const QUESTIONS = [
  { key: 'hairImageChoice', type: 'images', title: 'Which image best describes your hair loss?', options: [
    { id: 'thinning', label: 'Diffuse thinning' },
    { id: 'bald_patches', label: 'Bald patches / localized' },
    { id: 'receding', label: 'Receding hairline' },
    { id: 'mild_thin', label: 'Mild overall thinning' },
  ]},
  { key: 'familyHistory', type: 'radio', title: 'Family history of hair loss?', options: ['No','Yes paternal side','Yes maternal side','Both'] },
  { key: 'dandruff', type: 'radio', title: 'Do you have dandruff?', options: ['No','Mild','Heavy','Health condition'] },
  { key: 'sleep', type: 'radio', title: 'How well do you sleep?', options: ['Sound 8 hours','Disturbed sleep','Insomnia'] },
  { key: 'stress', type: 'range', title: 'How stressed are you (1–10)?', min:1, max:10 },
  { key: 'gastric', type: 'conditional', title: 'Do you have any gastric problem?', options: ['No','Yes'], followUpKey:'gastricDetails', followUpPlaceholder:'Describe gastric issue' },
  { key: 'energy', type: 'range', title: 'Energy level during day (1–10)', min:1, max:10 },
  { key: 'medication', type: 'conditional', title: 'Are you on any medication?', options:['No','Yes'], followUpKey:'medicationDetails', followUpPlaceholder:'List medications' },
  { key: 'scalpImage', type: 'image-upload', title: 'Upload / take a scalp picture', note:'A clear top-down image helps experts' }
];

const findCustomers = (q='') => {
  if (!q) return [];
  const term = q.toLowerCase();
  return customersData.filter(c => [c.id, c.name, c.email, c.phone].join(' ').toLowerCase().includes(term));
};

const NewAnalysis = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [confirmCustomer, setConfirmCustomer] = useState(false);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scalpImage, setScalpImage] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);

  const handleSearch = (q) => {
    setSearchTerm(q);
    setMatches(findCustomers(q));
  };

  const startAnalysisForCustomer = (customer) => {
    setSelectedCustomer(customer);
    setConfirmCustomer(true);
  };

  const updateAnswer = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }));

  const next = () => setStep(s => Math.min(QUESTIONS.length - 1, s + 1));
  const prev = () => setStep(s => Math.max(0, s - 1));

  // Submit: show AI loader for 3s then create analysis and navigate to report
  const submit = async () => {
    setAiLoading(true);
    // show mock AI progress for 3 seconds
    await new Promise(res => setTimeout(res, 3000));

    // create analysis record (this also triggers background generation in storage utility)
    const payload = {
      customerId: selectedCustomer?.id || null,
      customerSnapshot: selectedCustomer || { name: searchTerm || 'Guest' },
      answers: { ...answers },
      scalpImageBase64: scalpImage
    };

    const record = createAnalysis(payload); // returns record with testId
    setAiLoading(false);

    // navigate to report page (report may be pending -> page will refresh / show pending)
    navigate(`/analysis/report/${record.testId}`);
  };

  const q = QUESTIONS[step];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">New Analysis</h1>

      {!confirmCustomer && (
        <div className="bg-white rounded-lg p-4 border mb-6">
          <h2 className="font-semibold mb-2">Search Customer</h2>
          <div className="flex gap-2 mb-3">
            <input className="flex-1 p-2 border rounded" placeholder="Search by name, email or phone" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} />
            <button onClick={() => handleSearch(searchTerm)} className="px-3 py-2 border rounded">Search</button>
          </div>

          <div>
            {matches.length ? matches.map(m => (
              <div key={m.id} className="p-2 border rounded flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium">{m.name} <span className="text-xs text-gray-500 ml-2">{m.id}</span></div>
                  <div className="text-sm text-gray-500">{m.email} • {m.phone || 'No phone'}</div>
                </div>
                <button onClick={() => startAnalysisForCustomer(m)} className="px-3 py-2 bg-blue-600 text-white rounded">Select</button>
              </div>
            )) : <div className="text-sm text-gray-500">No matches yet</div>}
          </div>

          <div className="mt-4">
            <div className="text-sm mb-2">Or proceed without selecting a customer:</div>
            <button onClick={() => { setSelectedCustomer({ id: null, name: searchTerm || 'Guest' }); setConfirmCustomer(true); }} className="px-4 py-2 border rounded">Proceed as {searchTerm || 'Guest'}</button>
          </div>
        </div>
      )}

      {confirmCustomer && (
        <>
          <div className="bg-white rounded-lg p-4 border mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{selectedCustomer?.name || 'Guest'}</div>
                <div className="text-sm text-gray-500">{selectedCustomer?.email || 'No email'} • {selectedCustomer?.phone || 'No phone'}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setConfirmCustomer(false); setSelectedCustomer(null); }} className="px-3 py-2 border rounded">Change</button>
                <button onClick={() => { /* start wizard */ }} className="px-3 py-2 bg-green-600 text-white rounded">Start Analysis</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{q.title}</h3>
                {q.note && <div className="text-xs text-gray-500">{q.note}</div>}
              </div>
              <div className="text-sm text-gray-500">{step + 1}/{QUESTIONS.length}</div>
            </div>

            <div className="mb-6">
              {/* Question UIs */}
              {q.type === 'images' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {q.options.map(opt => (
                    <button key={opt.id} onClick={() => { updateAnswer(q.key, opt.label); next(); }} className={`p-3 border rounded text-left ${answers[q.key] === opt.label ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="h-24 bg-gray-100 rounded mb-2 flex items-center justify-center text-sm">{opt.label}</div>
                      <div className="text-sm">{opt.label}</div>
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'radio' && (
                <div className="space-y-2">
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                      <input type="radio" name={q.key} checked={answers[q.key] === opt} onChange={() => updateAnswer(q.key, opt)} />
                      <span>{opt}</span>
                    </label>
                  ))}
                  <div className="mt-3">
                    <button onClick={next} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
                  </div>
                </div>
              )}

              {q.type === 'range' && (
                <div>
                  <input type="range" min={q.min} max={q.max} value={answers[q.key] ?? Math.floor((q.min+q.max)/2)} onChange={(e) => updateAnswer(q.key, Number(e.target.value))} />
                  <div className="mt-2">Value: <strong>{answers[q.key] ?? Math.floor((q.min+q.max)/2)}</strong></div>
                  <div className="mt-3 flex gap-2">
                    {step > 0 && <button onClick={prev} className="px-3 py-2 border rounded">Back</button>}
                    <button onClick={next} className="px-3 py-2 bg-blue-600 text-white rounded">Next</button>
                  </div>
                </div>
              )}

              {q.type === 'conditional' && (
                <div>
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                      <input type="radio" name={q.key} checked={answers[q.key] === opt} onChange={() => updateAnswer(q.key, opt)} />
                      <span>{opt}</span>
                    </label>
                  ))}
                  {answers[q.key] === 'Yes' && (
                    <div className="mt-2">
                      <textarea placeholder={q.followUpPlaceholder} value={answers[q.followUpKey] || ''} onChange={(e) => updateAnswer(q.followUpKey, e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    {step > 0 && <button onClick={prev} className="px-3 py-2 border rounded">Back</button>}
                    <button onClick={next} className="px-3 py-2 bg-blue-600 text-white rounded">Next</button>
                  </div>
                </div>
              )}

              {q.type === 'image-upload' && (
                <div>
                  <ImageUploader value={scalpImage} onChange={setScalpImage} />
                  <div className="mt-3 flex gap-2">
                    {step > 0 && <button onClick={prev} className="px-3 py-2 border rounded">Back</button>}
                    <button onClick={() => { updateAnswer(q.key, scalpImage); next(); }} className="px-3 py-2 bg-blue-600 text-white rounded">Next</button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div style={{ width: `${Math.round(((step)/QUESTIONS.length)*100)}%` }} className="h-full bg-blue-600" />
              </div>
              <div className="text-xs text-gray-500 mt-2">{step} completed • {QUESTIONS.length - step} remaining</div>
            </div>

            {step === QUESTIONS.length - 1 && (
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setStep(0)} className="px-3 py-2 border rounded">Review</button>
                <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">Submit Analysis</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* AI mock loader */}
      {aiLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="bg-white p-6 rounded shadow z-10 w-[520px] text-center">
            <h3 className="text-lg font-semibold mb-2">Analyzing image — AI processing</h3>
            <p className="text-sm text-gray-600 mb-4">We are running the analysis. This takes a few seconds.</p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-blue-600 animate-progress" style={{ width: '85%' }} />
            </div>
            <style>{`
              @keyframes progress {
                0% { width: 0% }
                50% { width: 60% }
                100% { width: 100% }
              }
              .animate-progress { animation: progress 3s linear forwards; }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewAnalysis;
