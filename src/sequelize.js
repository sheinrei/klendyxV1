import { Sequelize } from "sequelize";
import user from './models/utilisateur.js';
import token from "./models/token.js"

/**
 * Connection à la base de donnée
 * 
 */


export default async function connectDb() {
    const db = new Sequelize("calendyx", process.env.DB_USER, process.env.DB_PASSWORD, {
        host: 'localhost',
        dialect: "mariadb",
        dialectOptions: {
            timezone: "Etc/GMT-2"
        },
        logging: false,
    });

    try {
        await db.authenticate();
        console.log("connection à la db réussis");
    } catch (err) {
        console.log("Impossible de se connecter à la base de donnée", err);
    }

    //table utilisateur
    user(db)
    //table des tokens
    token(db)
    try {
        await db.sync()
    } catch (err) {
        console.log("Erreur lors de la syncronisation de la db : ", err);
    }

    return db
}