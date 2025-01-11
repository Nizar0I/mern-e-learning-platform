import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllCourses } from "../services/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const search = searchParams.get("search") || "";
        const { data } = await getAllCourses(search);
        setCourses(data);
      } catch (err) {
        setError(
          err.response?.data?.error || "Erreur lors du chargement des cours"
        );
      }
    };

    fetchCourses();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Nos cours</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/courses/${course._id}`}
            className="block bg-white shadow rounded overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={course.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&w=800&q=80"}
              alt="course"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-2">
                {course.description?.slice(0, 80)}...
              </p>
              <p className="text-blue-600 font-bold">
                {course.price === 0 ? "Gratuit" : `${course.price} €`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;
