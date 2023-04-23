import { Router } from "express";
import courceController from "../controller/course";
import { auth } from "../middleware/auth.middleware";
const router: Router = Router();
router.get("/", courceController.getCourse);
router.get("/auth", auth, courceController.getCourseAuth);
router.get("/:id", courceController.getCourseVLById);
router.get("/auth/:id", auth, courceController.getCourseById);

router.post("/create", auth, courceController.create);
router.put("/enroll/:id", auth, courceController.enroll);
router.put("/accept/:id", auth, courceController.acceptEnroll);
router.put("/addComment/:id", auth, courceController.addComment);
router.put("/remove/:id", auth, courceController.removenroll);
router.put("/addEnroll/:id", auth, courceController.addEnroll);
router.delete("/delete/:id", auth, courceController.delete);





export default router;
