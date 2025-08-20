import express from "express";
import Anime from "../models/Anime.js";

const router = express.Router();

// Получить все
router.get("/", async (_req, res) => {
  try { res.json(await Anime.find().sort({ createdAt: -1 })); }
  catch { res.status(500).json({ error: "Ошибка при получении каталога" }); }
});

// Добавить
router.post("/", async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const created = await Anime.create({ title, description, image });
    res.status(201).json(created);
  } catch {
    res.status(400).json({ error: "Проверьте параметры: title, description, image" });
  }
});

export default router;