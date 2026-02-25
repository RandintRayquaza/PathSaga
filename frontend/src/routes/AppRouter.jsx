import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import PageLoader from '../components/ui/PageLoader';
import AppLayout from '../components/layout/AppLayout';

/* Code-split all pages */
const Home            = lazy(() => import('../pages/Home'));
const Dashboard       = lazy(() => import('../pages/Dashboard'));
const Assessment      = lazy(() => import('../pages/Assessment'));
const EditProfile     = lazy(() => import('../pages/Profile'));
const ProfileView     = lazy(() => import('../pages/ProfileView'));
const Settings        = lazy(() => import('../pages/Settings'));
const Login           = lazy(() => import('../auth/Login'));
const Signup          = lazy(() => import('../auth/Signup'));
const NotFound        = lazy(() => import('../pages/NotFound'));
const AiChat          = lazy(() => import('../pages/AiChat'));

/** Redirect authenticated users away from auth pages */
function PublicOnlyRoute({ children }) {
  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  if (!isAuth) return children;
  return <Navigate to="/dashboard" replace />;
}

/** Require auth */
function PrivateRoute({ children }) {
  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  return isAuth ? children : <Navigate to="/login" replace />;
}



export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/"       element={<Home />} />
        
        {/* Auth routes — redirect logged-in users to dashboard */}
        <Route path="/login"  element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />

        {/* Protected routes */}
        <Route path="/complete-profile" element={<PrivateRoute><AppLayout><EditProfile /></AppLayout></PrivateRoute>} />
        <Route path="/profile"          element={<PrivateRoute><AppLayout><ProfileView /></AppLayout></PrivateRoute>} />
        <Route path="/profile/edit"     element={<PrivateRoute><AppLayout><EditProfile /></AppLayout></PrivateRoute>} />
        <Route path="/settings"         element={<PrivateRoute><AppLayout><Settings /></AppLayout></PrivateRoute>} />
        <Route path="/assessment"       element={<PrivateRoute><AppLayout><Assessment /></AppLayout></PrivateRoute>} />
        <Route path="/dashboard"        element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
        <Route path="/aichat"           element={<PrivateRoute><AppLayout><AiChat /></AppLayout></PrivateRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

