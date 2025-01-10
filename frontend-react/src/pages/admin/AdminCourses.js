// src/pages/admin/AdminCourses.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const AdminCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
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
      await fetchCourses(token);
    } catch (err) {
      navigate('/login');
    }
  };

  const fetchCourses = async (token) => {
    try {
      // Suppose qu’on a GET /admin/courses
      const { data } = await axios.get('http://localhost:3000/admin/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCourses(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des cours');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestion des cours</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="min-w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Titre</th>
            <th className="py-2 px-4">Instructeur</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id} className="border-b">
              <td className="py-2 px-4">{course._id}</td>
              <td className="py-2 px-4">{course.title}</td>
              <td className="py-2 px-4">{course.instructorId}</td>
              <td className="py-2 px-4">
                {/* Boutons pour éditer ou supprimer (optionnels) */}
                <button className="bg-green-500 text-white px-2 py-1 mr-2 rounded">
                  Éditer
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCourses;
