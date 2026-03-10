
import { Sequelize } from "sequelize";

import { userPreferenceTable } from "./models/userPreferenceTable.js";
import userTable from "./models/utilisateurTable.js";
import tokenTable from "./models/tokenTable.js";
import { userSessionTable } from "./models/userSessionTable.js";
import { creditTable } from "./models/creditTable.js";
import { contactFavTable } from "./models/contactFavTable.js";
import { matchingEventTable } from "./models/matchingEventTable.js";
import { eventKlendyxTable } from "./models/eventKlendyxTable.js";
import { klendyxPropositionRdvTable } from "./models/klendyxPropositionRdvTable.js";
import { commentTable } from "./models/commentTable.js";
import { rappelRdvTable } from "./models/rappelRdvTable.js";


const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: '+00:00',
    logging: false,
    dialectOptions: {
        useUTC: true,
        dateStrings: true,
        typeCast: function (field, next) {
            if (field.type === "DATETIME") {
                return field.string(); 
            }
            return next();
        }
    }
});


// fonction init de la bdd
export async function initDb() {

    // init des tables
    userPreferenceTable(db)
    userTable(db);
    tokenTable(db);
    userSessionTable(db)
    klendyxPropositionRdvTable(db);
    creditTable(db);
    commentTable(db);
    contactFavTable(db);
    matchingEventTable(db)
    eventKlendyxTable(db)
    rappelRdvTable(db)

    let force = process.env.SEQUELIZE_FORCE
    force === "true" ? (force = true, console.log("Sequelize remise à zero de la db")) : force = false
    try {
        await db.authenticate();
        console.log("✅ Connection à la DB réussie");
        await db.sync({ force });
        console.log("✅ DB synchronisée");
    } catch (err) {
        console.error("❌ Impossible de se connecter à la DB", err);
    }
}


export default db;
