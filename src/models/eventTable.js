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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        plateformSender: {
            type: DataTypes.STRING, //sms ou mail
            allowNull: false
        },
        recipientName: {
            type: DataTypes.STRING,//corp de l'objet
            allowNull: false
        },
        recipientContactEmail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        recipientContactSms: {
            type: DataTypes.STRING,
            allowNull: true
        },
        titleEvent: {
            type: DataTypes.STRING,
            allowNull: false
        },
        messageEvent: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateDebut: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dateFin: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        messageReturn: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING,// Etat de l'envois et réponse -> message envoyé, reponse ok|| nok
            allowNull: false,
            defaultValue: "Initialisation"
        },
        response: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
        {
            timestamps: true,
            paranoid: true, // quand instance.destroys() ne vas pas detruire mais remplir ce champs
        }
    )
}