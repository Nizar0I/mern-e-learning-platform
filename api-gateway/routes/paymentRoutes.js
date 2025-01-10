// routes/payment.routes.js
const router = require("express").Router();
const axios = require("axios");

// POST /payments
router.post("/", async (req, res) => {
  try {
    const { data } = await axios.post(
      "http://payment-service:3003/payments",
      req.body
    );
    return res.json(data);
  } catch (err) {
    console.error("Erreur création paiement:", err.message);
    return res.status(500).json({ error: "Erreur interne" });
  }
});

// GET /payments/:id
router.get("/:id", async (req, res) => {
  try {
    const { data } = await axios.get(
      `http://payment-service:3003/payments/${req.params.id}`
    );
    return res.json(data);
  } catch (err) {
    console.error("Erreur récupération paiement:", err.message);
    return res.status(500).json({ error: "Erreur interne" });
  }
});

module.exports = router;
