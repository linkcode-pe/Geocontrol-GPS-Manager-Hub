import mysql from "mysql2/promise";
let pool: mysql.Pool | undefined;
export function db() {
  if (!pool) {
    const { DB_HOST="127.0.0.1", DB_USER, DB_PASSWORD, DB_NAME="geocontrol_hub" } = process.env;
    if (!DB_USER || !DB_PASSWORD) throw new Error("Database credentials are not configured");
    pool = mysql.createPool({ host:DB_HOST, user:DB_USER, password:DB_PASSWORD, database:DB_NAME, connectionLimit:5, waitForConnections:true, timezone:"Z" });
  }
  return pool;
}
