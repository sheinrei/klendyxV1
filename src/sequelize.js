import dotenv from "dotenv";
dotenv.config();


import { Sequelize } from "sequelize";
import userTable from "./models/utilisateurTable.js";
import tokenTable from "./models/tokenTable.js";
import { eventTable } from "./models/eventTable.js";
import { creditTable } from "./models/creditTable.js";
import { commentTable } from "./models/commentTable.js";
import { contactFavTable } from "./models/contactFavTable.js";
import { userSessionTable } from "./models/userSessionTable.js";


const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: '+02:00',
    logging: false,
});


// fonction init de la bdd
export async function initDb() {

    // init des tables
    userTable(db);
    tokenTable(db);
    eventTable(db);
    creditTable(db);
    commentTable(db);
    contactFavTable(db);
    userSessionTable(db)

    let force = process.env.SEQUELIZE_FORCE
    force === "true" ? (force = true, console.log("🗑️  Sequelize remise à zero de la db")) : force = false
    try {
        await db.authenticate();
        console.log("✅ Connection à la DB réussie");
        await db.sync({ force: force });
        console.log("✅ DB synchronisée");
    } catch (err) {
        console.error("❌ Impossible de se connecter à la DB", err);
    }
}

export default db;
