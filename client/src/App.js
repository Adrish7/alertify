import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Content from './components/layout/Content';
import ForgotPassword from './components/pages/ForgotPassword';
import { ProjectsProvider, SelectedProjectProvider } from './context';
import { Settings } from './components/Settings';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <SelectedProjectProvider>
        <ProjectsProvider>
          <Routes>
            {/* Redirect root to /app */}
            <Route path="/" element={<Navigate to="/app" replace />} />
            
            {/* Public Routes (standalone pages) */}
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Your existing app (unchanged, loads at /app/*) */}
            <Route path="/app/*" element={
              <main 
                data-testid="application" 
                className={darkMode ? 'darkmode' : undefined}
              >
                <Settings />
                <Content />
              </main>
            }/>
          </Routes>
        </ProjectsProvider>
      </SelectedProjectProvider>
    </Router>
  );
}

export default App;