// src/data/employeesStorage.js
// Defensive loader + seeder for employees
const STORAGE_KEY = 'employees_v1'; // <-- make sure other code uses the same key

const demoSeed = () => ([
  {
    id: 'E001',
    firstName: 'John',
    lastName: 'Anderson',
    email: 'john.anderson@example.com',
    phone: '+1-555-0123',
    role: 'Admin',
    status: 'Active',
    avatar: null,
    projects: [
      { id: 'P001', name: 'Alpha', role: 'Lead', description: 'Health data ingestion' },
      { id: 'P002', name: 'Beta', role: 'Contributor', description: 'Reporting & dashboards' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'E002',
    firstName: 'Sofia',
    lastName: 'Martinez',
    email: 'sofia.martinez@example.com',
    phone: '+1-555-0456',
    role: 'Tester',
    status: 'Invitation Sent',
    avatar: null,
    projects: [],
    createdAt: new Date().toISOString()
  }
]);

const isValidArray = (v) => Array.isArray(v);

export const loadEmployees = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = demoSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      console.info('[employeesStorage] no data found — seeding demo data', STORAGE_KEY, seed);
      return seed;
    }

    // parse stored value
    const parsed = JSON.parse(raw);

    // If the stored value is not an array, re-seed (defensive)
    if (!isValidArray(parsed)) {
      const seed = demoSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      console.warn('[employeesStorage] stored value malformed — reseeding', STORAGE_KEY, parsed);
      return seed;
    }

    // If array exists but is empty, seed demo data (explicit behavior)
    if (parsed.length === 0) {
      const seed = demoSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      console.info('[employeesStorage] stored array was empty — reseeding demo data', STORAGE_KEY, seed);
      return seed;
    }

    // otherwise return parsed array
    console.debug('[employeesStorage] loaded employees from storage', STORAGE_KEY, parsed.length);
    return parsed;
  } catch (err) {
    console.error('[employeesStorage] error reading storage, seeding fallback', err);
    const seed = demoSeed();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch (e) { /* ignore */ }
    return seed;
  }
};

export const saveEmployees = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    console.debug('[employeesStorage] saved employees, count=', Array.isArray(list) ? list.length : '??');
  } catch (err) {
    console.error('[employeesStorage] failed to save employees', err);
  }
};

export const genEmployeeId = (list = []) => {
  const nums = list.map((e) => parseInt((e.id || '').replace(/^E0*/, '') || 0, 10));
  const max = nums.length ? Math.max(...nums) : 0;
  const next = max + 1;
  return `E${String(next).padStart(3, '0')}`;
};
