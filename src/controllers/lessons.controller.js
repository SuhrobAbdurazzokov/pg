import { pg } from "../db/index.js";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/success-response.js";

class LessonController {
    async create(req, res, next) {
        try {
            const { course_id, title, content } = req.body;

            const courseId = await pg.query(
                "SELECT * FROM courses WHERE id = $1",
                [course_id]
            );

            if (courseId.rows.length === 0) {
                throw new AppError("Course id not found", 404);
            }

            const data = await pg.query(
                "INSERT INTO lessons (course_id, title, content) VALUES ($1, $2, $3) RETURNING *",
                [course_id, title, content]
            );

            if (!course_id || !title || !content) {
                throw new AppError(
                    "Course id, title and content field required",
                    400
                );
            }

            return successRes(res, data.rows, 201);
        } catch (error) {
            next(error);
        }
    }

    async getAll(_, res, next) {
        try {
            const data = await pg.query(
                "SELECT lessons.title, lessons.content, courses.title, courses.description FROM lessons INNER JOIN courses ON courses.id = lessons.course_id"
            );
            return successRes(res, data.rows);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const id = req?.params?.id;

            const data = await pg.query(
                "SELECT lessons.title, lessons.content, courses.title, courses.description FROM lessons INNER JOIN courses ON lessons.course_id = courses.id WHERE lessons.id = $1",
                [id]
            );

            if (data.rows.length === 0) {
                throw new AppError("Lesson id not found", 404);
            }

            return successRes(res, data.rows);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = req.params?.id;

            const { course_id, title, content } = req.body;

            const data = await pg.query(
                "UPDATE lessons SET course_id = $1, title = $2, content = $3 WHERE id = $4 RETURNING *",
                [course_id, title, content, id]
            );

            return successRes(res, data.rows);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = req?.params?.id;

            await pg.query("DELETE FROM lessons WHERE id = $1", [id]);

            return successRes(res, {});
        } catch (error) {
            next(error);
        }
    }
}

export default new LessonController();
