import express from "express";
import {
  getAllCVEs,
  getCVEById,
  getCVEByYear,
  getCVEByScore,
  getCVEByLastModified,
} from "../controllers/cveControllers.js";

const router = express.Router();

router.get("/", getAllCVEs);
router.get("/:id", getCVEById);
router.get("/year/:year", getCVEByYear);
router.get("/lastmodified/:year", getCVEByLastModified);
router.get("/score", getCVEByScore);

export default router;
