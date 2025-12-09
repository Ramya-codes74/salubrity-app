import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, Brain, Calendar, DollarSign, BarChart3, Settings, Sliders, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    {
        key: 'customers', label: 'Customers', icon: Users, children: [
            { key: 'list', label: 'List Customers', to: '/customers/list' },
            { key: 'groups', label: 'Customer Groups', to: '/customers/groups' }
        ]
    },
    {
        key: 'employees', label: 'Employees', icon: UserCog, children: [
            { key: 'employees-list', label: 'List Employees', to: '/employees/list' },
            { key: 'roles-permissions', label: 'Roles & Permissions', to: 'roles' }
        ]
    },
    {
        key: 'testing', label: 'Testing', icon: Brain, badge: 'AI', children: [
            { key: 'analysis-history', label: 'Analysis History', to: '/analysis/history' },
            // { key: 'reports', label: 'Reports', to: 'testing/reports' },
            { key: 'new-analysis', label: 'New Analysis', to: 'analysis/new' }
        ]
    },
    {
        key: 'appointments', label: 'Appointments', icon: Calendar,
        children: [
            { key: 'manage-appointments', label: 'Manage Appointments', to: 'appointments/manage' },
            { key: 'book-appointment', label: 'Book Appointment', to: 'appointments/book' }
        ]
    },
    {
        key: 'finance', label: 'Finance', icon: Coins,
        children: [
            { key: 'invoices', label: 'Invoices', to: 'finance/invoices' },
            { key: 'payments', label: 'Payment Received', to: 'finance/payments' },
            { key: 'expenses', label: 'Expenses', to: 'finance/expenses' },
            { key: 'pl-statement', label: 'P&L Statement', to: 'finance/pl' },
            { key: 'tax-reports', label: 'Tax Reports', to: 'finance/tax' }
        ]
    },
    {
        key: 'reports', label: 'Reports', icon: BarChart3,
        children: [
            { key: 'treatment-efficiency', label: 'Treatment Efficiency', to: 'reports/treatment' },
            { key: 'business-overview', label: 'Business Overview', to: 'reports/business' }
        ]
    },
    {
        key: 'settings', label: 'Settings', icon: Settings, children: [
            { key: 'org-profile', label: 'Organization Profile', to: 'settings/profile' },
            { key: 'address-list', label: 'Address List', to: 'settings/addresses' },
            { key: 'ai-models', label: 'AI Models', to: 'settings/ai-models' }
        ]
    },
    {
        key: 'configuration', label: 'Configuration', icon: Sliders,
        children: [
            { key: 'cms-config', label: 'CMS Configuration', to: 'configuration/cms' }
        ]
    }
];

const Sidebar = () => {
    const { sidebarOpen, user } = useApp();
    const [expanded, setExpanded] = useState({});

    if (!sidebarOpen) return null;

    return (
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Acme</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Powered by Salubrity</p>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0) ?? 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((m) => (
                    <div key={m.key}>
                        {m.children ? (
                            <>
                                <button
                                    onClick={() => setExpanded(prev => ({ ...prev, [m.key]: !prev[m.key] }))}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <m.icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="flex-1 text-left text-sm font-medium">{m.label}</span>
                                    {m.badge && (
                                        <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-semibold">
                                            {m.badge}
                                        </span>
                                    )}
                                </button>
                                {expanded[m.key] && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {m.children.map((c) => (
                                            <NavLink
                                                key={c.key}
                                                to={c.to}
                                                className={({ isActive }) => `w-full block px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                            >
                                                {c.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <NavLink
                                to={m.to}
                                className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <m.icon className="w-5 h-5 flex-shrink-0" />
                                <span className="flex-1 text-left text-sm font-medium">{m.label}</span>
                            </NavLink>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
