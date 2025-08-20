import "dotenv/config";
import mongoose from "mongoose";
import Anime from "./models/Anime.js";

const data = [
  { title: "Naruto", description: "История о юном ниндзя.", image: "/images/naruto.jpg" },
  { title: "One Piece", description: "Пираты и Великий путь.", image: "/images/onepiece.jpg" },
  { title: "Attack on Titan", description: "Человечество против титанов.", image: "/images/aot.jpg" },
];

await mongoose.connect(process.env.MONGO_URI, { dbName: "animeDB" });
await Anime.deleteMany({});
await Anime.insertMany(data);
console.log("✅ База заполнена");
await mongoose.disconnect();
process.exit(0);