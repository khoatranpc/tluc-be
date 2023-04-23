import { Router } from "express";
import userController from "../controller/user";
import userMiddleWare from "../middleware/user/user";
import { auth } from "../middleware/auth.middleware";
const router: Router = Router();

router.post("/create", userMiddleWare.create, userController.createUser);
router.post("/login", userMiddleWare.login, userController.login);
router.get("/me", auth, userController.myInformation);
router.get("/", auth, userController.listUser);
router.get("/dashboard", auth, userController.dashboard);
router.get('/:email',userController.getUser);

router.put("/update/:id", auth, userController.updateInformation);
router.put("/addLessonDone/", auth, userController.addLessonDone);
router.delete("/delete/:id", auth, userController.deleteUser);

export default router;
