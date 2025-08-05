import { Pool } from "pg";
import config from "../config/index.js";

export const pg = new Pool({
    connectionString: config.DB.DATABASE_URI,
});
export const connectDB = async () => {
    try {
        await pg.query("SELECT NOW()");

        console.log("Connected to database");
    } catch (error) {
        console.log("Error on connecting database to server: ", error);
        process.exit(1);
    }
};
