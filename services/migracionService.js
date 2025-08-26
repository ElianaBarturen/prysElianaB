import { getConnection } from "../database/connection.js";
import sql from "mssql";
import { MongoClient } from "mongodb";

const mongoUrl = "mongodb://localhost:27017";
const mongoClient = new MongoClient(mongoUrl);

const insertToNoSql1 = async (data) => {
  try {
    console.log(`Insertando ${data.length} registros en NoSQL...`);

    await mongoClient.connect();
    const db = mongoClient.db("dashboard_asistencia");
    const collection = db.collection("asistencia_historico");

    await collection.insertMany(data);

    return true;
  } catch (error) {
    console.error("Error en migración (NoSQL):", error);
    return false;
  }
};


export const migrarLote = async (iddatabase, idempresa) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("iddatabase", sql.VarChar, iddatabase)
    .input("idempresa", sql.VarChar, idempresa)
    .execute("GetAsistenciaPorLotes");

  const data = result.recordset;

  if (!data || data.length === 0) {
    return { success: true, message: "No hay datos para migrar" };
  }

  const inserted = await insertToNoSql(data);
  if (!inserted) {
    return { success: false, message: "Error al insertar en NoSQL" };
  }

  const primerId = data[0].idasistencia;
  const ultimoId = data[data.length - 1].idasistencia;
  const totalMigrados = data.length;

  await pool
    .request()
    .input("iddatabase", sql.VarChar, iddatabase)
    .input("idempresa", sql.VarChar, idempresa)
    .input("primerIdMigrado", sql.VarChar, primerId)
    .input("ultimoIdMigrado", sql.VarChar, ultimoId)
    .input("totalMigrados", sql.Int, totalMigrados)
    .execute("LogInsertMigracionAsistencia");
    
    console.log("[OK] Log de migración registrado en SQL.");

  return { success: true, message: `Migrados ${data.length} registros` };
};


