// src/pages/admin/AdminUsers.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        navigate('/');
        return;
      }
      // Si admin => on récupère la liste des utilisateurs
      await fetchUsers(token);
    } catch (err) {
      navigate('/login');
    }
  };

  const fetchUsers = async (token) => {
    try {
      // On suppose que l’API expose GET /admin/users
      const { data } = await axios.get('http://localhost:3000/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestion des utilisateurs</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="min-w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Nom d'utilisateur</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="py-2 px-4">{u._id}</td>
              <td className="py-2 px-4">{u.username}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
