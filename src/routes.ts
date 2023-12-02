import { Router } from "express";
import { ArtController } from "./controllers/ArtController";
import { ReportController } from "./controllers/ReportController";

const artController = new ArtController();
const reportController = new ReportController();

const router = Router();

router.get("/", artController.handle);
router.post("/report", reportController.handle);

export { router };
