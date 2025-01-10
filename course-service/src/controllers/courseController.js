const Course = require("../models/Course");

// POST /courses (create a new course)
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    return res.status(201).json(course);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { search, instructorId } = req.query;

    let filter = {};

    // Add search filter if applicable
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add instructor filter if applicable
    if (instructorId) {
      filter.instructorId = instructorId;
    }

    const courses = await Course.find(filter);
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /courses/:id (get one course by ID)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }
    return res.status(200).json(course);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the data against the schema
    });
    if (!course) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }
    return res.status(200).json(course);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /courses/:id (delete a course)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }
    return res.status(200).json({ message: "Cours supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
