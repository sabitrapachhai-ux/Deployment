import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './styles.css';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

const Home = lazy(() => import('./pages/public/Home'));
const Services = lazy(() => import('./pages/public/Services'));
const Inventory = lazy(() => import('./pages/public/Inventory'));
const Track = lazy(() => import('./pages/public/Track'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Repairs = lazy(() => import('./pages/admin/Repairs'));
const Stock = lazy(() => import('./pages/admin/Inventory'));
const Messages = lazy(() => import('./pages/admin/Messages'));
const Content = lazy(() => import('./pages/admin/Content'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="loading-page">Loading...</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="in-stock" element={<Inventory />} />
              <Route path="track" element={<Track />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
            </Route>
            <Route path="admin/login" element={<Login />} />
            <Route path="admin" element={<ProtectedRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="repairs" element={<Repairs />} />
              <Route path="inventory" element={<Stock />} />
              <Route path="messages" element={<Messages />} />
              <Route path="content/:resource" element={<Content />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  </React.StrictMode>,
);
