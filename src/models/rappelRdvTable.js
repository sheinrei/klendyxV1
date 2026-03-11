import { DataTypes } from "sequelize"


export function rappelRdvTable(sequelize) {
    return sequelize.define("rappelRdv", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dayEvent: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        timeBefore: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        state: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {
                "sms": {
                    "sent": false,
                    "sentAt": null,
                    "error": null
                },
                "email": {
                    "sent": false,
                    "sentAt": null,
                    "error": null
                }
            }
        }


    }, {
        sequelize,
        timestamps: true,
        updatedAt: false,
    })
}