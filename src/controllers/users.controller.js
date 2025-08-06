import { pg } from "../db/index.js";
import { successRes } from "../utils/success-response.js";
import { AppError } from "../error/AppError.js";

export class UserController {
    async create(req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            const roles = ["teacher", "student"];

            if (!name || !email || !password || !role) {
                throw new AppError(
                    "name, email, password and roles required",
                    400
                );
            }

            if (!roles.includes(role)) {
                throw new AppError(
                    "Role required only 'student' or 'teacher'",
                    400
                );
            }

            const data = await pg.query(
                "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
                [name, email, password, role]
            );

            return successRes(res, data.rows[0], 201);
        } catch (error) {
            next(error);
        }
    }

    async getAll(_, res, next) {
        try {
            const data = await pg.query(
                "SELECT users.id, users.name, courses.title, courses.description, lessons.course_id, lessons.title, lessons.content FROM users INNER JOIN courses ON users.id = courses.teacher_id INNER JOIN lessons ON lessons.course_id = courses.id"
            );
            return successRes(res, data.rows);
        } catch (error) {
            next(error);
        }
    }

    async getByid(req, res, next) {
        try {
            const id = req?.params?.id;

            const data = await pg.query(
                "SELECT users.id, users.name, courses.title, courses.description, lessons.course_id, lessons.title, lessons.content FROM users INNER JOIN courses ON users.id = courses.teacher_id INNER JOIN lessons ON lessons.course_id = courses.id WHERE users.id = ($1)",
                [id]
            );

            if (data.rows.length === 0) {
                throw new AppError(`User not found by id: ${id}`, 404);
            }

            return successRes(res, data.rows);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = req?.params?.id;
            const { name, email, password, role } = req.body;
            const data = await pg.query(
                "UPDATE users SET name = ($1), email = $2, password = $3, role = $4 WHERE id = $5 RETURNING *",
                [name, email, password, role, id]
            );

            if (data.rows.length === 0) {
                throw new AppError(`User not found by id: ${id}`, 404);
            }

            return successRes(res, data.rows);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = req?.params?.id;

            await pg.query("DELETE FROM users WHERE id = $1", [id]);

            return successRes(res, {});
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
