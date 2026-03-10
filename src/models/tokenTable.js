import { DataTypes } from "sequelize"


export default (sequelize) => {
    return sequelize.define("token", {
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
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        sequelize,
        timestamps: true,
        updatedAt: false,
    })
}