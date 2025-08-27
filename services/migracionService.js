import { getConnection } from "../database/connection.js";
import sql from "mssql";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl =process.env.MONGO_URI;
const mongoClient = new MongoClient(mongoUrl);

const insertToNoSql = async (data) => {
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
  let totalRegistrosMigrados = 0;
  let loteNumero = 1;

  while (true) {
    console.log(`[INFO] Procesando lote ${loteNumero}...`);

    const result = await pool
      .request()
      .input("iddatabase", sql.VarChar, iddatabase)
      .input("idempresa", sql.VarChar, idempresa)
      .execute("GetAsistenciaPorLotes");

    const data = result.recordset;

    // Si no hay datos, terminar el bucle
    if (!data || data.length === 0) {
      console.log("[INFO] No hay más datos para migrar");
      break;
    }

    console.log(`[INFO] Lote ${loteNumero}: ${data.length} registros encontrados`);

    // Insertar en NoSQL
    const inserted = await insertToNoSql(data);
    if (!inserted) {
      return { 
        success: false, 
        message: `Error al insertar en NoSQL en el lote ${loteNumero}`,
        totalMigrados: totalRegistrosMigrados
      };
    }

    const primerId = data[0].idasistencia;
    const ultimoId = data[data.length - 1].idasistencia;
    const totalMigrados = data.length;

    // Registrar log de migración
    await pool
      .request()
      .input("iddatabase", sql.VarChar, iddatabase)
      .input("idempresa", sql.VarChar, idempresa)
      .input("primerIdMigrado", sql.VarChar, primerId)
      .input("ultimoIdMigrado", sql.VarChar, ultimoId)
      .input("totalMigrados", sql.Int, totalMigrados)
      .execute("LogInsertMigracionAsistencia");
    
    console.log(`[OK] Lote ${loteNumero}: Log de migración registrado en SQL.`);
    
    totalRegistrosMigrados += totalMigrados;
    loteNumero++;
  }

  return { 
    success: true, 
    message: `Migración completada. Total de registros migrados: ${totalRegistrosMigrados}`,
    totalMigrados: totalRegistrosMigrados,
    lotesTotales: loteNumero - 1
  };
};


