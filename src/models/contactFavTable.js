import DataTypes from "sequelize"

export function contactFavTable(sequelize) {
    return sequelize.define("contactFavori", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: false
    })
}