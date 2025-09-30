import dotenv from "dotenv";
dotenv.config();


import { Sequelize } from "sequelize";
import userTable from "./models/utilisateurTable.js";
import tokenTable from "./models/tokenTable.js";
import { eventTable } from "./models/eventTable.js";

const db = new Sequelize("calendyx", process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: { timezone: "Etc/GMT-2" },
    logging: false,
});


// fonction init de la bdd
export async function initDb() {

    // init des tables
    userTable(db);
    tokenTable(db);
    eventTable(db);

    try {
        await db.authenticate();
        console.log("✅ Connection à la DB réussie");
        await db.sync();
        console.log("✅ DB synchronisée");
    } catch (err) {
        console.error("❌ Impossible de se connecter à la DB", err);
    }
}

export default db;
