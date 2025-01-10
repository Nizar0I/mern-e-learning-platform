import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        navigate('/'); // ou '/login'
      }
    } catch (err) {
      navigate('/login');
    }
  }, [navigate]);

  // ... (le rendu de la page si on est admin)
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      {/* ... */}
    </div>
  );
};

export default AdminDashboard;
