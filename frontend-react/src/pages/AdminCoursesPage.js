import { useEffect, useState } from "react";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/api";

function AdminCoursesPage() {
  // List of courses
  const [courses, setCourses] = useState([]);
  // Search term
  const [searchTerm, setSearchTerm] = useState("");
  // Track if modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Distinguish between "create mode" and "edit mode"
  const [isEditMode, setIsEditMode] = useState(false);

  // Course form states (for create/edit)
  const [courseId, setCourseId] = useState(null); // used only in edit mode
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState("");
  const [description, setDescription] = useState("");

  // Error & success messages
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses("");
  }, []);

  // Re-fetch courses whenever searchTerm changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Call your fetch with the updated search term
      fetchCourses(searchTerm);
    }, 500); // Debounce for half a second

    // Cleanup
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Function to fetch courses based on a search query
  const fetchCourses = async (searchValue) => {
    try {
      setError("");
      const response = await getAllCourses(searchValue);
      setCourses(response.data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setError("Failed to fetch courses.");
    }
  };

  // Handle deleting a course
  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");
      await deleteCourse(courseId);
      setMessage("Course deleted successfully!");
      fetchCourses(searchTerm);
    } catch (error) {
      console.error("Failed to delete course:", error);
      setError("Failed to delete course.");
    }
  };

  // Open modal in CREATE mode
  const openCreateModal = () => {
    setIsEditMode(false);
    setCourseId(null);
    setTitle("");
    setPrice("");
    setCategories("");
    setDescription("");
    setError("");
    setMessage("");
    setIsModalOpen(true);
  };

  // Open modal in EDIT mode
  const openEditModal = (course) => {
    setIsEditMode(true);
    setCourseId(course._id);
    setTitle(course.title || "");
    setPrice(course.price || "");
    setCategories(course.categories?.join(", ") || "");
    setDescription(course.description || "");
    setError("");
    setMessage("");
    setIsModalOpen(true);
  };

  // Handle create/update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const categoryArray = categories
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);

    // Prepare the payload
    const payload = {
      title,
      price: parseFloat(price) || 0,
      categories: categoryArray,
      description,
    };

    try {
      if (isEditMode) {
        // Update existing course
        if (!courseId) {
          setError("Missing courseId in edit mode.");
          return;
        }
        await updateCourse(courseId, payload);
        setMessage("Course updated successfully!");
      } else {
        // Create new course
        await createCourse(payload);
        setMessage("Course created successfully!");
      }

      // Close modal & refresh list
      setIsModalOpen(false);
      fetchCourses(searchTerm);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.error ||
          (isEditMode
            ? "Failed to update course."
            : "Failed to create course.")
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Courses (Admin)</h2>

      {/* Search Section */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={() => fetchCourses(searchTerm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={openCreateModal}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create New Course
        </button>
      </div>

      {/* Error / Success Messages */}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Categories</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4 text-gray-500"
                >
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course._id}>
                  <td className="py-2 px-4 border-b">{course.title}</td>
                  <td className="py-2 px-4 border-b">
                    {course.price ? `$${course.price}` : "—"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {(course.categories || []).join(", ")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => openEditModal(course)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal (Create/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded p-6 relative">
            <h3 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Course" : "Create Course"}
            </h3>

            {/* Error / Success Messages inside modal */}
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {message && <p className="text-green-600 mb-2">{message}</p>}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              {/* Categories */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Categories</label>
                <input
                  type="text"
                  placeholder="e.g. Science des données, Communication"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Separate multiple categories with commas.
                </p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Description</label>
                <textarea
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEditMode ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCoursesPage;
