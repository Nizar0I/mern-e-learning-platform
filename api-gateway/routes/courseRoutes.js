const router = require("express").Router();
const axios = require("axios");

// GET /courses
router.get("/", async (req, res) => {
  try {
    const { data } = await axios.get("http://course-service:3002/courses", {
      params: req.query, // Pass query params like `search` or `instructorId`
    });
    return res.json(data);
  } catch (err) {
    console.error("Erreur récupération des cours:", err.message);
    return res.status(500).json({ error: "Erreur interne" });
  }
});

// GET /courses/:id
router.get("/:id", async (req, res) => {
  try {
    const { data } = await axios.get(
      `http://course-service:3002/courses/${req.params.id}`
    );
    return res.json(data);
  } catch (err) {
    console.error("Erreur récupération cours par ID:", err.message);
    return res.status(500).json({ error: "Erreur interne" });
  }
});

// POST /courses
router.post("/", async (req, res) => {
  try {
    const { data } = await axios.post(
      "http://course-service:3002/courses",
      req.body
    );
    return res.status(201).json(data);
  } catch (err) {
    console.error("Erreur création cours:", err.message);
    return res.status(500).json({ error: "Erreur interne" });
  }
});

// PUT /courses/:id (Update course by ID)
router.put("/:id", async (req, res) => {
  try {
    const { data } = await axios.put(
      `http://course-service:3002/courses/${req.params.id}`,
      req.body
    );
    return res.json(data);
  } catch (err) {
    console.error("Erreur mise à jour cours:", err.message);
    return res.status(500).json({ error: "Erreur interne" });
  }
});

// DELETE /courses/:id (Delete course by ID)
router.delete("/:id", async (req, res) => {
  try {
    const { data } = await axios.delete(
      `http://course-service:3002/courses/${req.params.id}`
    );
    return res.json({ message: "Cours supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression cours:", err.message);
    return res.status(500).json({ error: "Erreur interne" });
  }
});

module.exports = router;
