import { DataTypes } from "sequelize";


/**
 * Table des events.
 */

export function eventTable(sequelize) {
    return sequelize.define("event", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING, //sms ou mail
            allowNull: false
        },
        recipient: {
            type: DataTypes.STRING,//phone ou email
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,//corp de l'objet
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,// Etat de l'envois et réponse -> message envoyé, reponse ok|| nok
            allowNull: false
        }
    },
        {
            timestamps: true,
            paranoid: true, // au instance.destroys() ne vas pas detruire mais remplir ce champs
        }
    )
}