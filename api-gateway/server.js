require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require("./routes/courseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/payments", paymentRoutes);


// Exemple d'endpoint pour tester
app.get('/', (req, res) => {
  res.send('API Gateway is running');
});

// Démarrage
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
