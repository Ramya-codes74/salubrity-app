import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RBACProvider } from '../context/RBACContext';
import MainLayout from '../components/layout/MainLayout';
import NotFound from '../pages/NotFound';

// lazy load pages
const Login = lazy(() => import('../components/auth/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const CustomerList = lazy(() => import('../pages/Customers/CustomerList'));
const CustomerDetail = lazy(() => import('../pages/Customers/CustomerDetail'));
const CustomerGroups = lazy(() => import('../pages/Customers/CustomerGroups'));
const EmployeesList = lazy(() => import('../pages/Employees/EmployeesList'));
// lazy loaded pages
// const EmployeesList = lazy(() => import('../pages/Employees/EmployeeList'));
const EmployeeAdd = lazy(() => import('../pages/Employees/EmployeeForm'));
const EmployeeEdit = lazy(() => import('../pages/Employees/EmployeeForm'));
const EmployeeView = lazy(() => import('../pages/Employees/EmployeeView'));
const RolesList = lazy(() => import('../pages/Roles/RoleList'));
const RoleForm = lazy(() => import('../pages/Roles/RoleForm'));
const NewAnalysis = lazy(() => import('../pages/Analysis/NewAnalysis'));
const AnalysisReport = lazy(() => import('../pages/Analysis/AnalysisReport'));
const HairReport = lazy(() => import('../pages/Analysis/HairReport'));
const AnalysisHistory = lazy(() => import('../pages/Analysis/AnalysisHistory'));
const OrganizationPage = lazy(() => import('../pages/settings/OrganizationPage'));
const AiModels = lazy(() => import('../pages/settings/AiModels'));
const AddressList = lazy(() => import('../pages/settings/AddressList'));


const ProtectedRoute = ({ children }) => {
    const { user, authLoaded } = useApp();
    // While restoring auth, show a loading UI (or null) so router doesn't redirect.
    if (!authLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Restoring session…</div>
            </div>
        );
    }
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

export default function AppRoutes() {
    return (
        <RBACProvider>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    </Route>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="customers">
                        <Route path="list" element={<CustomerList />} />
                        <Route path="groups" element={<CustomerGroups />} />
                        <Route path=":id" element={<CustomerDetail />} />
                    </Route>
                    {/* Employees */}
                    <Route path="employees">
                        <Route index element={<Navigate to="list" replace />} />
                        <Route path="list" element={<EmployeesList />} />
                        <Route path="add" element={<EmployeeAdd mode="add" />} />
                        <Route path="edit/:id" element={<EmployeeEdit mode="edit" />} />
                        <Route path="view/:id" element={<EmployeeView />} />

                    </Route>
                    <Route path="roles">
                        <Route index element={<RolesList />} />
                        <Route path="new" element={<RoleForm mode="create" />} />
                        <Route path="edit/:role" element={<RoleForm mode="edit" />} />
                    </Route>
                    
                    <Route path="analysis">
                        <Route path="new" element={<NewAnalysis />} />
                         <Route path="report/:id" element={<HairReport />} />
                         <Route path="history" element={<AnalysisHistory />} />
                        {/* <Route path="report/:id" element={<AnalysisReport />} /> */}
                        </Route>

                       <Route path="settings">
                       <Route path="profile" element={<OrganizationPage />} />
                       <Route path="ai-models" element={<AiModels />} />
                        <Route path="addresses" element={<AddressList />} />
                       
                  </Route>

{/* Not Found */}
<Route path="*" element={<NotFound />} />

{/* Redirect */}
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
</RBACProvider>
    )
};