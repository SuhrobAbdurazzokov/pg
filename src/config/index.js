import { config } from "dotenv";

config();

export default {
    PORT: Number(process.env.PORT),

    DB: {
        DATABASE_URI: String(process.env.DATABASE_URI),
    },
};
