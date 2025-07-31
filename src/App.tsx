import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Submissions from './pages/Submissions';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/UI/LoadingSpinner';
import Notification from './components/UI/Notification';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className="min-h-screen pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problem/:slug" element={<ProblemDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" replace /> : <Register />} 
          />
          <Route 
            path="/submissions" 
            element={
              <ProtectedRoute>
                <Submissions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Notification />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;