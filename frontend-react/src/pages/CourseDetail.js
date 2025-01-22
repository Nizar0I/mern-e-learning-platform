import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { getCourseById, getPurchaseStatus } from '../services/api';
import { useCart } from '../context/CartContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [isPurchased, setIsPurchased] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Erreur lors du chargement du cours');
      }
    };
    fetchCourse();
  }, [id]);

  // Check purchase status after course is loaded
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        if (userId && course) {
          const { data } = await getPurchaseStatus(userId, course._id);
          setIsPurchased(data.purchased);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de l'achat :", err);
      }
    };
    checkPurchaseStatus();
  }, [course]);

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  if (!course) {
    return <p className="p-4">Chargement...</p>;
  }

  const handleAddToCart = () => {
    addToCart(course);
    alert("Course added to cart!");
  };

  // Extract the introductory lecture if available
  const introLecture = course.content &&
    course.content.length > 0 &&
    course.content[0].lectures &&
    course.content[0].lectures.length > 0
    ? course.content[0].lectures[0]
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={course.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&w=800&q=80"}
          alt="course"
          className="w-80 h-40 object-cover"
        />

        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <p className="text-xl font-semibold mb-6">
            Prix :
            <span className="ml-2 text-blue-600">
              {course.price === 0 ? 'Gratuit' : `${course.price} €`}
            </span>
          </p>

          {!isPurchased ? (
            <>
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
              >
                Ajouter au Panier
              </button>
              {introLecture && introLecture.videoUrl && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">Vidéo d'intro</h3>
                  <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full"
                      src={introLecture.videoUrl.replace("watch?v=", "embed/")}
                      title="Intro Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/mycourses/${id}`)}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
            >
              Accéder au cours
            </button>
          )}
        </div>
      </div>

      {isPurchased && course.content && (
  <div className="mt-8">
    <h3 className="text-2xl font-bold mb-4">Contenu du cours</h3>
    {course.content.map((section, idx) => {
      // Clean the title by removing duplicate "Module X:" prefixes
      let cleanedTitle = section.sectionTitle;
      const parts = cleanedTitle.split(':');
      if(parts.length >= 3 && parts[0].trim() === parts[1].trim()){
        // Reassemble the title as "Module X: Title"
        cleanedTitle = parts[0].trim() + ':' + parts.slice(2).join(':');
      }

      return (
        <div key={idx} className="mb-6 bg-gray-100 p-4 rounded shadow">
          <h4 className="text-xl font-semibold mb-2">{cleanedTitle}</h4>
        </div>
      );
    })}
  </div>
)}


    </div>
  );
};

export default CourseDetail;