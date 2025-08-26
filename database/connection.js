import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true" ? true : process.env.DB_ENCRYPT === "strict" ? "strict" : false,
    trustServerCertificate: process.env.DB_TRUST_CERT === "true", // true si estás en local
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};


let pool;

export const getConnection = async () => {
  if (pool) return pool;
  try {
    //console.log("Config SQL usado:", config);
    pool = await sql.connect(config);
    console.log("Conexión a SQL Server establecida");
    return pool;
  } catch (error) {
    console.error("Error al conectar a SQL Server:", error);
    throw error;
  }
};


export { sql };
