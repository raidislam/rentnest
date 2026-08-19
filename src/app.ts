import express from "express";
import cors from "cors";
import authRoutes from './app/modules/auth/auth.route'
import categoryRoutes from './app/modules/category/category.route'
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RentNest API is running",
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/categories",categoryRoutes)

export default app;