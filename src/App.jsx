import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Homepage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navbar from './components/navbar/Navbar';
import useAuth from './context_store/auth_store';
import useProperty from './context_store/property_store';
import Explore from './pages/Explore';
import Insights from './pages/Insights';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Public Route component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { initialize, user } = useAuth();
  const { fetchAmenities, fetchPropertiesByOwner, fetchAllProperties } = useProperty();

  useEffect(() => {
    initialize();
    fetchAmenities();
    fetchAllProperties();
    if (user?.id) {
      fetchPropertiesByOwner(user.id);
    }
    const fetchData = async () => {
      await initialize();
      fetchAmenities();
      fetchAllProperties();
    };
    
    fetchData();
  }, [initialize, fetchAmenities, fetchAllProperties]);

  // Separate useEffect for user-dependent operations
  useEffect(() => {
    if (user?.id) {
      fetchPropertiesByOwner(user.id);
    }
  }, [user, fetchPropertiesByOwner]);

  return (
    <Router>
      <div className="min-h-screen bg-[#1A1A2E]">
        {useAuth().isAuthenticated && <Navbar />}
        <main className="pt-16">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Homepage />
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

            <Route 
              path="/explore" 
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              } 
            />

            <Route path="/insights/:apn" element={<ProtectedRoute>
                  <Insights />
                </ProtectedRoute>} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
