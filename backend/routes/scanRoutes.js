import express from "express";
import { startScan } from "../controllers/scanController.js";

const router = express.Router();

router.post("/", startScan);

export default router;