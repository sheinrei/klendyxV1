import { DataTypes } from "sequelize";


export function klendyxPropositionRdvTable(sequelize) {
    return sequelize.define("klendyxPropositionRdv", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },


        methodContactSms: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        methodContactEmail: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        recipientPhone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        recipientEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },


        recipientName: {
            type: DataTypes.STRING,
            allowNull: false
        },


        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        commentaire: {
            type: DataTypes.STRING,
            allowNull: false
        },


        dayStart: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hourStart: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hourEnd: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        rappel: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },

        state: {
            type: DataTypes.STRING,// Etat de l'envois et réponse -> message envoyé, reponse ok|| nok
            allowNull: false,
            defaultValue: "Initialisation"
        },

        //reponse du client
        recipientReponse: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        recipientComment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
        {
            timestamps: true,
            paranoid: true, // quand instance.destroys() ne vas pas detruire mais remplir ce champs
        }
    )
}