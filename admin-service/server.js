const express = require('express');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware for parsing JSON
app.use(express.json());

// Admin routes
app.use('/admin', adminRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Admin service listening on port ${PORT}`);
});
