import express from "express";
import migracionRoutes from "./routes/migracion.js";
const app = express();

app.use(express.json());

app.use("/api/migracion", migracionRoutes);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API de asistencia funcionando exitosamente");
});

app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});

