import express from "express";
import { migrarLote } from "../services/migracionService.js";

const router = express.Router();

router.post("/:iddatabase/:idempresa", async (req, res) => {
  const { iddatabase, idempresa } = req.params;

  try {
    const result = await migrarLote(iddatabase, idempresa);
    res.json(result);
  } catch (error) {
    console.error("Error en migración:", error);
    res.status(500).json({ success: false, message: "Error en migración" });
  }
});

router.get("/:iddatabase/:idempresa", async (req, res) => {
  const { iddatabase, idempresa } = req.params;
  try {
    const result = await migrarLote(iddatabase, idempresa);
    res.json(result);
  } catch (error) {
    console.error("Error en migración:", error);
    res.status(500).json({ success: false, message: "Error en migración" });
  }
});


export default router;
