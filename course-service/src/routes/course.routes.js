const router = require('express').Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

// Create a course
router.post("/", createCourse);

// Get all courses (optionally filtered by ?search=...)
router.get("/", getCourses);

// Get one course by ID
router.get("/:id", getCourseById);

// PUT /courses/:id
router.put("/:id", updateCourse);

// DELETE /courses/:id
router.delete("/:id", deleteCourse);



module.exports = router;