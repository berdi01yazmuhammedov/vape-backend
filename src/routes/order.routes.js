import { Router } from "express";
import express from "express";
import { createOrder, deleteOrder, getOrders } from "../controllers/order.controller.js"

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.delete("/:id", deleteOrder)
export default router;