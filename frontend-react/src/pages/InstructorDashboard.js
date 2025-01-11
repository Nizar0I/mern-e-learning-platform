import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Or import { jwtDecode } from 'jwt-decode', depending on your version
import {
  createCourse,
  getAllCourses,
  getCoursesByInstructor,
  updateCourse,
  deleteCourse,
} from "../services/api";

const InstructorDashboard = () => {
  // Champs pour le formulaire (pas d'instructorId dans le state)
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [image, setImage] = useState("");


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const openEditModal = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setCategories(course.categories || "");
    setVideoUrl(course.content[0]?.lectures[0]?.videoUrl || "");
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedCourse = {
        ...editingCourse,
        title,
        description,
        price: parseFloat(price),
        categories,
        content: [
          {
            ...editingCourse.content[0],
            lectures: [
              {
                ...editingCourse.content[0]?.lectures[0],
                videoUrl,
              },
            ],
          },
        ],
      };
      await updateCourse(editingCourse._id, updatedCourse);
      setMessage("Cours mis à jour avec succès !");
      setIsModalOpen(false);
      setTitle("");
      setCategories("");
      setDescription("");
      setPrice("");
      setVideoUrl("");
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la mise à jour du cours");
    }
  };



  // État pour messages/erreurs
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Liste des cours
  const [courses, setCourses] = useState([]);

  // ID du formateur récupéré depuis le token
  const [instructorId, setInstructorId] = useState(null);

  const navigate = useNavigate();

  // Au montage : récupérer l'ID formateur + charger les cours
  useEffect(() => {
    checkInstructorRole();
    fetchInstructorIdFromToken();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (instructorId) {
      fetchCourses();
    }
  }, [instructorId]);

  // Vérifie si l'utilisateur est instructeur
  // Sinon, redirection ou message d'erreur
  const checkInstructorRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Pas de token => pas connecté => retour accueil
        navigate("/login");
        return;
      }
      const decoded = jwtDecode(token);
      if (decoded.role !== "instructor") {
        // L'utilisateur n'a pas le rôle 'instructor'
        navigate("/");
      }
    } catch (err) {
      // Si token invalide ou erreur => retour accueil
      navigate("/");
    }
  };

  // 1) Récupérer l'ID formateur du token JWT (stocké dans localStorage)
  const fetchInstructorIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.role === "instructor") {
          setInstructorId(decoded.userId);
        } else {
          console.warn("L'utilisateur connecté n'est pas formateur.");
        }
      }
    } catch (err) {
      console.error("Erreur lors du décodage du token:", err);
    }
  };

  // 2) Charger la liste des cours
  const fetchCourses = async () => {
    try {
      if (!instructorId) return; // Ensure we have the instructorId before fetching
      const { data } = await getCoursesByInstructor(instructorId);
      console.log("Instructor :", instructorId);
      console.log("Fetched instructor courses:", data);

      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.log(err.message)
      setError(
        err.response?.data?.error || "Erreur lors du chargement des cours"
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result); 
      // reader.result is something like "data:image/png;base64, iVBORw0KGgoAAAANSUhEUg..."
    };
  };

  // 3) Créer un nouveau cours
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
  
    const categoryArray = categories
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);
  
    const payload = {
      title,
      description,
      instructorId, 
      price: parseFloat(price) || 0,
      categories: categoryArray,
      content: [
        {
          sectionTitle: "Introduction",
          lectures: [
            {
              title: "Vidéo d’intro",
              videoUrl,
              duration: 5,
              resources: [],
            },
          ],
        },
      ],
      image: image, // <-- pass the Base64 string
    };
  
    try {
      await createCourse(payload);
      setMessage("Le cours a été créé avec succès !");
      // Clear fields
      setTitle("");
      setCategories("");
      setDescription("");
      setPrice("");
      setVideoUrl("");
      setImage("");   // <-- clear the image
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la création du cours");
    }
  };
  


  // 5) Supprimer un cours
  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setMessage("Cours supprimé avec succès !");
      fetchCourses();
    } catch (err) {
      setError(
        err.response?.data?.error || "Erreur lors de la suppression du cours"
      );
    }
  };


  

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Ajouter un nouveau cours</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Titre du cours */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Titre du cours</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Node.js Masterclass"
              required
            />
          </div>

          {/* Image */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>


          {/* Catégories */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Catégories</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              required // Make it a required field
            >
              <option value="" disabled>
                -- Sélectionnez une catégorie --
              </option>
              <option value="Science des données">Science des données</option>
              <option value="Leadership">Leadership</option>
              <option value="Communication">Communication</option>
              <option value="Analyses et Information Economiques">
                Analyses et Information Economiques
              </option>
              <option value="Development Web">Development Web</option>
              <option value="Mathématiques Appliquées">Mathématiques Appliquées</option>
              <option value="Thermodynamiques des Fluides">
                Thermodynamiques des Fluides
              </option>
            </select>
          </div>


          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le contenu du cours..."
              required
            />
          </div>

          {/* Prix */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Prix</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 29.99"
              required
            />
          </div>

          {/* Lien vidéo (pour la première lecture) */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">
              Lien de la vidéo (intro)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Créer le cours
          </button>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Modifier le cours</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Titre</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Catégories</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    -- Sélectionnez une catégorie --
                  </option>
                  <option value="Science des données">Science des données</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Communication">Communication</option>
                  <option value="Analyses et Information Economiques">
                    Analyses et Information Economiques
                  </option>
                  <option value="Development Web">Development Web</option>
                  <option value="Mathématiques Appliquées">Mathématiques Appliquées</option>
                  <option value="Thermodynamiques des Fluides">
                    Thermodynamiques des Fluides
                  </option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Description</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Prix</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Lien Vidéo</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 text-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Liste des cours */}
      <div className="mt-8 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Mes cours</h2>
        {courses.length === 0 ? (
          <p>Aucun cours disponible</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Titre</th>
                <th className="px-4 py-2 border">Prix</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-4 py-2 border">{course.title}</td>
                  <td className="px-4 py-2 border">{course.price}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => openEditModal(course)}
                      className="text-blue-500 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-500"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
