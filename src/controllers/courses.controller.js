import { pg } from "../db/index.js";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/success-response.js";

class CourseController {
    async create(req, res, next) {
        try {
            const { title, description, teacher_id } = req.body;

            const teacherId = await pg.query(
                "SELECT * FROM users WHERE id = $1 AND role = 'teacher'",
                [teacher_id]
            );

            if (!title || !description || !teacher_id) {
                throw new AppError(
                    "title, description and teacher_id required",
                    400
                );
            }
            if (teacherId.rows.length === 0) {
                throw new AppError(`Teacher id not found: ${teacherId}`, 404);
            }

            const data = await pg.query(
                "INSERT INTO courses (title, description, teacher_id) VALUES ($1, $2, $3) RETURNING *",
                [title, description, teacher_id]
            );

            return successRes(res, data.rows[0], 201);
        } catch (error) {
            next(error);
        }
    }

    async getAll(_, res, next) {
        try {
            const data = await pg.query(
                "SELECT courses.title, courses.description, users.name, users.email, users.role, lessons.title, lessons.content FROM courses INNER JOIN users ON users.id = courses.teacher_id INNER JOIN lessons ON lessons.course_id = courses.id"
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
                "SELECT courses.title, courses.description, users.name, users.email, users.role, lessons.title, lessons.content FROM courses INNER JOIN users ON users.id = courses.teacher_id INNER JOIN lessons ON lessons.course_id = courses.id WHERE courses.id = $1",
                [id]
            );

            if (data.rows.length === 0) {
                throw new AppError("Course id not found", 404);
            }

            return successRes(res, data.rows[0]);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = req?.params?.id;

            const { title, description, teacher_id } = req.body;

            const data = await pg.query(
                "UPDATE courses SET title = $1, description = $2, teacher_id = $3  WHERE id = $4 RETURNING *",
                [title, description, teacher_id, id]
            );

            if (data.rows.length === 0) {
                throw new AppError("Course id not found", 404);
            }

            return successRes(res, data.rows[0], 201);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = req?.params?.id;

            await pg.query("DELETE FROM courses WHERE id = $1", [id]);

            return successRes(res, {});
        } catch (error) {
            next(error);
        }
    }
}

export default new CourseController();
