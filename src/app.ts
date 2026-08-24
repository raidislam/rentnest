import express from "express";
import cors from "cors";
import authRoutes from './app/modules/auth/auth.route'
import categoryRoutes from './app/modules/category/category.route'
import propertyRoutes from "./app/modules/property/property.route";
import landlordPropertyRoutes from "./app/modules/property/landlord.property.route";


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
app.use("/api/categories",categoryRoutes);
app.use("/api/properties",propertyRoutes);
app.use("/api/landlord/properties",landlordPropertyRoutes);

export default app;