import { Router } from "express";
import lessonController from "../controller/lesson";
import lessonMiddleWare from "../middleware/lesson";
import { auth } from "../middleware/auth.middleware";
const router: Router = Router();

router.post(
  "/create/:id",
  lessonMiddleWare.create,
  auth,
  lessonController.create
);

router.put("/update/:id", auth, lessonController.update);
router.delete("/delete/:id", auth, lessonController.delete);

export default router;
