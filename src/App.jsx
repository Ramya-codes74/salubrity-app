import React, { Suspense } from 'react';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AppProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </AppProvider>
  );
}

export default App;
