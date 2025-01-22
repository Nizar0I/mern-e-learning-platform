// paymentRoutes.js (CommonJS version)
const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post("/checkout", async (req, res) => {
  try {
    // Forward the request to your Payment microservice
    const { data } = await axios.post(
      "http://payment-service:3007/payments/checkout", 
      req.body
    );
    return res.json(data);
  } catch (error) {
    console.error("Erreur paiement (checkout):", error.message);
    return res.status(500).json({ error: "Erreur interne" });
  }
});


router.get("/purchase-status", async (req, res) => {
  try {
    // Forward the request to the Payment Service's purchase-status endpoint
    const response = await axios.get("http://payment-service:3007/payments/purchase-status", {
      params: req.query  // Forward query parameters: userId and courseId
    });
    res.json(response.data);
  } catch (error) {
    console.error("Erreur vérification achat:", error.message);
    res.status(500).json({ error: "Erreur interne" });
  }
});


module.exports = router;