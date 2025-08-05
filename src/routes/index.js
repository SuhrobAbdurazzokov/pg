import { Router } from "express";
import userRouter from "./users.route.js";
import courseRouter from "../routes/courses.route.js";
import lessonRouter from "./lessons.route.js";

const router = Router();

router
    .use("/user", userRouter)
    .use("/course", courseRouter)
    .use("/lesson", lessonRouter);

export default router;
