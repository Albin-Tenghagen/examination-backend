import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;
// TIMESTAMP CAN BE CREATED IN THE DATABASE!!!!!!!!!!
const pool = new Pool({
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
});

const testConnection = async () => {
  try {
    const res = await pool.query("SELECT id, email FROM users");
    console.log("Connected! users:", res.rows);

    console.log("Connecting to DB with:", {
      user: process.env.DBUSER,
      password: process.env.DBPASSWORD,
      database: process.env.DBNAME,
      host: process.env.DBHOST,
      port: process.env.DBPORT,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Connection error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
  }
};
export { pool, testConnection };
