import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./src/db.js";
import paymentRoutes from "./src/routes/payment.routes.js";

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
connectDB();

app.use("/payments", paymentRoutes);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
