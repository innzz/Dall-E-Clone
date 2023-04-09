import express from "express";

import authRoutes from "./authRoutes.js";
import postRoutes from "./postRoutes.js";
import dallERoutes from "./dallERoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/post", postRoutes);
router.use("/dallE", dallERoutes);

export default router;
