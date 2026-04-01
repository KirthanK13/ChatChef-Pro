import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ flex: 1, position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={true} 
        theme="light" 
        toastStyle={{ borderRadius: '16px', fontFamily: 'Outfit', fontWeight: 500 }}
      />
    </BrowserRouter>
  );
}

export default App;
