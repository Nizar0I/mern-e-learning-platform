import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 
import {
  createCourse,
  getCoursesByInstructor,
  updateCourse,
  deleteCourse,
} from "../services/api";

const InstructorDashboard = () => {
  // Course form states
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [image, setImage] = useState("");

  // Module-related states
  const [modules, setModules] = useState([]);
  const [moduleNumber, setModuleNumber] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleVideoUrl, setModuleVideoUrl] = useState("");

  // Other states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [instructorId, setInstructorId] = useState(null);

  const navigate = useNavigate();

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

  const checkInstructorRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const decoded = jwtDecode(token);
      if (decoded.role !== "instructor") {
        navigate("/");
      }
    } catch (err) {
      navigate("/");
    }
  };

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

  const fetchCourses = async () => {
    try {
      if (!instructorId) return;
      const { data } = await getCoursesByInstructor(instructorId);
      console.log("Instructor :", instructorId);
      console.log("Fetched instructor courses:", data);
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.log(err.message);
      setError(err.response?.data?.error || "Erreur lors du chargement des cours");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleAddModule = () => {
    if (moduleNumber && moduleTitle && moduleVideoUrl) {
      setModules(prevModules => [
        ...prevModules, 
        { moduleNumber, moduleTitle, videoUrl: moduleVideoUrl }
      ]);
      setModuleNumber("");
      setModuleTitle("");
      setModuleVideoUrl("");
    } else {
      setError("Veuillez remplir tous les champs du module.");
    }
  };

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
      content: modules.map((mod) => ({
        sectionTitle: `Module ${mod.moduleNumber}: ${mod.moduleTitle}`,
        lectures: [
          {
            title: `Vidéo du module ${mod.moduleNumber}`,
            videoUrl: mod.videoUrl,
            duration: 0, // Adjust duration as needed
            resources: [],
          },
        ],
      })),
      image: image,
    };

    try {
      await createCourse(payload);
      setMessage("Le cours a été créé avec succès !");
      setTitle("");
      setCategories("");
      setDescription("");
      setPrice("");
      setVideoUrl("");
      setImage("");
      setModules([]);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la création du cours");
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setMessage("Cours supprimé avec succès !");
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la suppression du cours");
    }
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setCategories(course.categories || "");
    setVideoUrl(course.content[0]?.lectures[0]?.videoUrl || "");
    // Initialize modules from course content
    if (course.content && Array.isArray(course.content)) {
      const initialModules = course.content.map((section) => ({
        moduleNumber: section.sectionTitle.match(/\d+/)?.[0] || "",
        moduleTitle: section.sectionTitle,
        videoUrl: section.lectures[0]?.videoUrl || ""
      }));
      setModules(initialModules);
    } else {
      setModules([]);
    }
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
        content: modules.map((mod) => ({
          sectionTitle: `Module ${mod.moduleNumber}: ${mod.moduleTitle}`,
          lectures: [
            {
              title: `Vidéo du module ${mod.moduleNumber}`,
              videoUrl: mod.videoUrl,
              duration: 0,
              resources: [],
            },
          ],
        })),
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

          {/* Module Addition Section */}
          <h3 className="text-xl font-bold mb-2">Ajouter des modules</h3>
          <p className="text-md mb-2">Veuillez inclure une intro comme 1er module</p>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Numéro du module</label>
            <input
              type="number"
              value={moduleNumber}
              onChange={(e) => setModuleNumber(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Titre du module</label>
            <input
              type="text"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Lien vidéo du module</label>
            <input
              type="text"
              value={moduleVideoUrl}
              onChange={(e) => setModuleVideoUrl(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <button
            type="button"
            onClick={handleAddModule}
            className="w-full py-2 bg-green-600 text-white rounded mb-4"
          >
            Ajouter le module
          </button>

          {modules.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold">Modules ajoutés:</h4>
              <ul className="list-disc list-inside">
                {modules.map((mod, idx) => (
                  <li key={idx}>
                    Module {mod.moduleNumber}: {mod.moduleTitle}{" "}
                    (<a href={mod.videoUrl} target="_blank" rel="noopener noreferrer">vidéo</a>)
                  </li>
                ))}
              </ul>
            </div>
          )}

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
    <div className="bg-white p-6 rounded shadow max-w-md w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Modifier le cours</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Titre du cours</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Catégories</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="Séparez les catégories par des virgules"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Prix</label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Lien vidéo</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        {/* Modules editing section */}
        {modules.map((mod, index) => (
          <div key={index} className="mb-4 border p-4 rounded">
            <h3 className="font-semibold mb-2">Modifier Module {index + 1}</h3>
            <div className="mb-2">
              <label className="block mb-1">Numéro du module</label>
              <input
                type="number"
                value={mod.moduleNumber}
                onChange={(e) => {
                  const updatedModules = [...modules];
                  updatedModules[index].moduleNumber = e.target.value;
                  setModules(updatedModules);
                }}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Titre du module</label>
              <input
                type="text"
                value={mod.moduleTitle}
                onChange={(e) => {
                  const updatedModules = [...modules];
                  updatedModules[index].moduleTitle = e.target.value;
                  setModules(updatedModules);
                }}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Lien vidéo du module</label>
              <input
                type="text"
                value={mod.videoUrl}
                onChange={(e) => {
                  const updatedModules = [...modules];
                  updatedModules[index].videoUrl = e.target.value;
                  setModules(updatedModules);
                }}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-600"
            onClick={() => setIsModalOpen(false)}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  </div>
)}

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