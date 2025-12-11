import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import GiftPage from './components/GiftPage';
import { GREETINGS } from './config/greetings';

function App() {
  return (
    <Router>
      <Container 
        maxWidth="lg" 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/gift/dave" replace />} />
          <Route path="/gift-for/:recipientId" element={<GiftPage />} />
          <Route path="*" element={<Navigate to="/gift/dave" replace />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;