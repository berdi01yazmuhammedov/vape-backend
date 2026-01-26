import "dotenv/config";
import crypto from "crypto";
import express from "express";
import cors from "cors";
import vapesRoutes from "./routes/vapes.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { supabase } from "./supabaseClient.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//routes
app.use("/api/vapes", vapesRoutes);

app.post("/api/orders", async (request, response) => {
  const { items, contact, contactType, isPickup, address } = request.body;

  if (!Array.isArray(items) || items.length === 0) {
    return response.status(400).json({ message: "Корзина пуста" });
  }
  if (!contact) {
    return response.status(400).json({ message: "Нет контактов" });
  }
  if (isPickup === "Доставка" && !address) {
    return response.status(400).json({ message: "Нет адреса доставки" });
  }
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const order = {
    id: crypto.randomUUID(),
    items,
    total_price: totalPrice,
    contact,
    contact_type: contactType,
    is_pickup: isPickup,
    address: isPickup === "Доставка" ? address : null,
    status: "Новый",
  };

  const { error } = await supabase.from("orders").insert(order);

  if (error) {
    return response.status(500).json({ error: error.message });
  }
  console.log("Пришел заказ: ", order);

  response.status(201).json({
    orderId: order.id,
  });
});

app.get("/api/orders", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});
console.log("APP STARTING...");

app.get("/", (req, res) => {
  res.send("Backend is alive 🚀");
});
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

app.listen(PORT, () => {
  console.log(`Серверт работает на порту :${PORT}`);
});
