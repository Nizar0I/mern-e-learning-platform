const express = require('express');
const router = express.Router();

router.get('/dashboard-stats', async (req, res) => {
  res.json({
    success: true,
    data: {
      coursesCount: 100,
      instructorsCount: 10,
      studentsCount: 50,
      completedPayments: 40,
      coursesPerInstructor: 10,
    },
  });
});

module.exports = router;
