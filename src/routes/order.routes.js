import { Router } from "express";
import express from "express";
import { createOrder, deleteOrder, getOrders } from "../controllers/order.controller.js"

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.delete("/orders:id", deleteOrder)
export default router;