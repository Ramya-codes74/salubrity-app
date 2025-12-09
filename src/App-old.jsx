import React, { createContext, useContext, useState, useEffect } from 'react';
import { Menu, X, Bell, Globe, Moon, Sun, ChevronDown, ChevronRight, Search, Filter, Plus, Edit, Trash2, Eye, Users, UserCog, Brain, Calendar, DollarSign, BarChart3, Settings, Sliders, LayoutDashboard, Building2, MapPin, Cpu, FileText } from 'lucide-react';

// Context for Authentication and Theme
const AppContext = createContext();

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{ user, login, logout, theme, toggleTheme, language, setLanguage, sidebarOpen, setSidebarOpen }}>
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </AppContext.Provider>
  );
};

// Login Component
const Login = () => {
  const { login } = useApp();
  const [step, setStep] = useState('identifier');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleIdentifierSubmit = (e) => {
    e.preventDefault();
    const trimmedIdentifier = identifier.trim();
    if (trimmedIdentifier) {
      setIdentifier(trimmedIdentifier);
      setStep('password');
      setError('');
    } else {
      setError('Please enter email or username');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      login({
        name: 'John Anderson',
        role: 'System Administrator',
        email: identifier,
        avatar: null
      });
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-12 flex-col justify-between">
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">Acme </h1>
          <p className="text-blue-100 text-sm">Powered by Salubrity</p>
        </div>
        {/* <div className="text-white/80">
          <p className="text-lg mb-4">Enterprise-grade multi-tenant healthcare management platform</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span>Advanced AI-powered diagnostics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span>Comprehensive patient management</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span>Real-time analytics and reporting</span>
            </div>
          </div>
        </div> */}
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Acme </h1>
            <p className="text-gray-600 text-sm">Powered by Salubrity</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-600">Sign in to access your admin dashboard</p>
            </div>

            {step === 'identifier' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email or Username
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your email or username"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="button"
                  onClick={handleIdentifierSubmit}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition"
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setStep('identifier')}
                      className="text-sm text-gray-600 hover:text-gray-700"
                    >
                      Change user
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your password"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">Signing in as: {identifier}</p>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition"
                >
                  Sign In
                </button>
                <p className="text-xs text-gray-500 text-center">Demo password: admin123</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = () => {
  const { sidebarOpen, user } = useApp();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [currentPath, setCurrentPath] = useState('dashboard');

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
    {
      key: 'customers',
      label: 'Customers',
      icon: Users,
      children: [
        { key: 'list-customers', label: 'List Customers', path: 'customers/list' },
        { key: 'customer-groups', label: 'Customer Groups', path: 'customers/groups' }
      ]
    },
    {
      key: 'employees',
      label: 'Employees',
      icon: UserCog,
      children: [
        { key: 'list-employees', label: 'List Employees', path: 'employees/list' },
        { key: 'roles-permissions', label: 'Roles & Permissions', path: 'employees/roles' }
      ]
    },
    {
      key: 'testing',
      label: 'Testing',
      icon: Brain,
      badge: 'AI',
      children: [
        { key: 'analysis-history', label: 'Analysis History', path: 'testing/history' },
        { key: 'reports', label: 'Reports', path: 'testing/reports' },
        { key: 'new-analysis', label: 'New Analysis', path: 'testing/new' }
      ]
    },
    {
      key: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      children: [
        { key: 'manage-appointments', label: 'Manage Appointments', path: 'appointments/manage' },
        { key: 'book-appointment', label: 'Book Appointment', path: 'appointments/book' }
      ]
    },
    {
      key: 'finance',
      label: 'Finance',
      icon: DollarSign,
      children: [
        { key: 'invoices', label: 'Invoices', path: 'finance/invoices' },
        { key: 'payments', label: 'Payment Received', path: 'finance/payments' },
        { key: 'expenses', label: 'Expenses', path: 'finance/expenses' },
        { key: 'pl-statement', label: 'P&L Statement', path: 'finance/pl' },
        { key: 'tax-reports', label: 'Tax Reports', path: 'finance/tax' }
      ]
    },
    {
      key: 'reports',
      label: 'Report & Analysis',
      icon: BarChart3,
      children: [
        { key: 'treatment-efficiency', label: 'Treatment Efficiency', path: 'reports/treatment' },
        { key: 'business-overview', label: 'Business Overview', path: 'reports/business' }
      ]
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: Settings,
      children: [
        { key: 'org-profile', label: 'Organization Profile', path: 'settings/profile' },
        { key: 'address-list', label: 'Address List', path: 'settings/addresses' },
        { key: 'ai-models', label: 'AI Models', path: 'settings/ai-models' }
      ]
    },
    {
      key: 'configuration',
      label: 'Configuration',
      icon: Sliders,
      children: [
        { key: 'cms-config', label: 'CMS Configuration', path: 'configuration/cms' }
      ]
    }
  ];

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Powered by Salubrity</p>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.key}>
            <button
              onClick={() => item.children ? toggleMenu(item.key) : setCurrentPath(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                currentPath === item.path
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
              {item.children && (
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${expandedMenus[item.key] ? 'rotate-90' : ''}`}
                />
              )}
            </button>
            {item.children && expandedMenus[item.key] && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((child) => (
                  <button
                    key={child.key}
                    onClick={() => setCurrentPath(child.path)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      currentPath === child.path
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

// TopBar Component
const TopBar = () => {
  const { user, logout, theme, toggleTheme, language, setLanguage, sidebarOpen, setSidebarOpen } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                {['English', 'Spanish', 'French'].map((lang) => (
                  <button
                    key={lang}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600" />
            ) : (
              <Sun className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                  <UserCog className="w-4 h-4" />
                  My Account
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Dashboard Component
const Dashboard = () => {
  const stats = [
    { label: 'Total Customers', value: '2,543', icon: Users, color: 'blue' },
    { label: 'Active Appointments', value: '128', icon: Calendar, color: 'green' },
    { label: 'Tests Completed', value: '4,891', icon: Brain, color: 'purple' },
    { label: 'Revenue (MTD)', value: '$45,320', icon: DollarSign, color: 'yellow' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Customer List Component
const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const customers = [
    { id: 'C001', name: 'Sarah Johnson', age: 34, gender: 'Female', acquiredOn: '2024-01-15', tests: 12, status: 'Active' },
    { id: 'C002', name: 'Michael Chen', age: 45, gender: 'Male', acquiredOn: '2024-02-20', tests: 8, status: 'Active' },
    { id: 'C003', name: 'Emma Williams', age: 29, gender: 'Female', acquiredOn: '2024-03-10', tests: 15, status: 'Inactive' },
    { id: 'C004', name: 'David Brown', age: 52, gender: 'Male', acquiredOn: '2024-01-05', tests: 20, status: 'Active' },
    { id: 'C005', name: 'Lisa Anderson', age: 38, gender: 'Female', acquiredOn: '2024-04-12', tests: 5, status: 'Active' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your customer base</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Customer ID', 'Name', 'Age', 'Gender', 'Acquired On', 'Total Tests', 'Status', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{customer.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{customer.age}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{customer.gender}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{customer.acquiredOn}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{customer.tests}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="View">
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition" title="Edit">
                        <Edit className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </button>
                      <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold">1-5</span> of <span className="font-semibold">5</span> customers
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilter(false)}></div>
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
              <button onClick={() => setShowFilter(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                  <option>All</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 mb-2" />
                <input type="date" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
              </div>

              <div className="pt-4 space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Apply Filters
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Customer</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900"
                    placeholder="Any additional information..."
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Layout Component
const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Router Component
const Router = () => {
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const { user } = useApp();

  const renderPage = () => {
    if (currentRoute === 'customers/list') {
      return <CustomerList />;
    }
    return <Dashboard />;
  };

  if (!user) {
    return <Login />;
  }

  return <MainLayout>{renderPage()}</MainLayout>;
};

// Main App Component
const App = () => {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
};

export default App;