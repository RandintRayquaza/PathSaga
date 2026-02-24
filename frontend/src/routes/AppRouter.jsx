import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import PageLoader from '../components/ui/PageLoader';

/* Code-split all pages */
const Home       = lazy(() => import('../pages/Home'));
const Dashboard  = lazy(() => import('../pages/Dashboard'));
const Assessment = lazy(() => import('../pages/Assessment'));
const Onboarding = lazy(() => import('../pages/Onboarding'));
const Login      = lazy(() => import('../auth/Login'));
const Signup     = lazy(() => import('../auth/Signup'));
const NotFound   = lazy(() => import('../pages/NotFound'));

function PrivateRoute({ children }) {
  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/signup"     element={<Signup />} />
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/assessment" element={<PrivateRoute><Assessment /></PrivateRoute>} />
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*"           element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
