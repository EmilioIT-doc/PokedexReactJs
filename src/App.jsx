import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LayoutHome from './pages/home/layout/LayoutHome';
import Login from './pages/AuthController/Login';
import Register from './pages/AuthController/Register';
import Carrito from './pages/Carrito/Carrito';
import Historial from './pages/Historial/historial';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { CarritoProvider } from './provider/CarritoContext'; // Asegúrate de que la importación esté correcta

function App() {
  return (
    <CarritoProvider>
      <Router>
        <div className='App'>
          <Routes>
            <Route path="/" element={<LayoutHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/historial" element={<Historial />} />
          </Routes>
        </div>
      </Router>
    </CarritoProvider>
  );
}

export default App;
