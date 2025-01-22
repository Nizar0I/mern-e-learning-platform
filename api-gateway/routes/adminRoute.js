// adminRoute.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// GET /dashboard-stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    // Forward to the actual admin service
    const { data } = await axios.get('http://admin-service:3006/admin/dashboard-stats');
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
