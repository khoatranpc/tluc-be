import { Request, Response, Router } from "express";
import userRouter from "./user.router";
import courceRouter from "./course.router";
import unitRouter from "./unit.router";
import lessonRouter from "./lesson.router";
import chatRouter from "./chat.router";
const router: Router = Router();
router.use("/api/user", userRouter);
router.use("/api/course", courceRouter);
router.use("/api/unit", unitRouter);
router.use("/api/lesson", lessonRouter);
router.use("/api/chat", chatRouter);

router.use("/", (req, res, next) => {
	res.json({
		message: "Welcome to TLU_C",
	});
});

export default router;
