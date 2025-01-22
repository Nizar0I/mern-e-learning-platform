import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../services/api';

const MyCourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');

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

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  if (!course) {
    return <p className="p-4">Chargement...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">{course.title}</h2>
      <p className="text-gray-700 mb-6">{course.description}</p>
      
      {course.content && course.content.length > 0 ? (
        course.content.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">{section.sectionTitle}</h3>
            {section.lectures && section.lectures.length > 0 ? (
              section.lectures.map((lecture, li) => (
                <div key={li} className="mb-4">
                  <p className="font-medium">{lecture.title}</p>
                  {lecture.videoUrl && (
                    <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                      <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src={lecture.videoUrl.replace("watch?v=", "embed/")}
                        title={lecture.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  
                </div>
              ))
            ) : (
              <p>Aucune leçon disponible dans ce module.</p>
            )}
          </div>
        ))
      ) : (
        <p>Aucun contenu disponible pour ce cours.</p>
      )}
    </div>
  );
};

export default MyCourseDetail;