import { Router } from "express";
import chatController from "../controller/chat";
import { auth } from "../middleware/auth.middleware";
const router: Router = Router();

router.get("/", auth, chatController.getAll);
router.post("/create", auth, chatController.create);

export default router;
