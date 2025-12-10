import { DataTypes } from "sequelize"


export function rappelRdvTable(sequelize) {
    return sequelize.define("rappelRdv", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idUser: {
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
        success: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        }


    }, {
        sequelize,
        timestamps: true,
        updatedAt: false,
    })
}