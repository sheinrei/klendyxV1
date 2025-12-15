import { DataTypes } from "sequelize"

export function userPreferenceTable(sequelize) {
    return sequelize.define("userPreference", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        emailNotification: {
            type: DataTypes.BOOLEAN,
            defaultValue : true,
            allowNull: false
        },
        doubleAuth: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull : false
        }
    }, {
        timestamps: false
    })
}