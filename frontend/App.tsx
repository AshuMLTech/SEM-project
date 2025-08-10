import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CreatePlanPage } from './pages/CreatePlanPage';
import { PlanDetailsPage } from './pages/PlanDetailsPage';
import { PlansListPage } from './pages/PlansListPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePlanPage />} />
              <Route path="/plans" element={<PlansListPage />} />
              <Route path="/plans/:id" element={<PlanDetailsPage />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}
