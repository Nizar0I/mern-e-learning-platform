import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';

import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

// Pages formateur
import InstructorDashboard from './pages/InstructorDashboard';

function App() {
  return (
    <CartProvider>
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          
          {/* Étudiants (existant) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Formateurs (nouveau) */}
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
    </CartProvider>
  );
}

export default App;
