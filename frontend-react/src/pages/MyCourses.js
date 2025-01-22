// src/pages/MyCourses.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { getAllCourses, getPurchaseStatus } from '../services/api';

const MyCourses = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        if (!userId) {
          setError("Identifiant utilisateur non trouvé.");
          setLoading(false);
          return;
        }

        // Fetch all courses
        const coursesResponse = await getAllCourses();
        const coursesData = coursesResponse.data;
        setAllCourses(coursesData);

        // Check purchase status for each course
        const purchaseStatusPromises = coursesData.map(course =>
          getPurchaseStatus(userId, course._id)
            .then(res => ({ course, purchased: res.data.purchased }))
            .catch(err => ({ course, purchased: false }))
        );

        const purchaseStatuses = await Promise.all(purchaseStatusPromises);

        // Filter courses that have been purchased
        const purchased = purchaseStatuses
          .filter(status => status.purchased)
          .map(status => status.course);

        setPurchasedCourses(purchased);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Erreur lors du chargement des cours achetés');
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mes Cours</h1>
      {purchasedCourses.length === 0 ? (
        <p>Aucun cours acheté.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {purchasedCourses.map(course => (
            <div key={course._id} className="bg-white shadow rounded overflow-hidden">
              <img
                src={course.image || "https://via.placeholder.com/300x200"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <p className="text-blue-600 font-bold mb-4">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(course.price)}</p>
                <button
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Voir les détails
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
