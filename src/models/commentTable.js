import DataTypes from "sequelize"

export function commentTable(sequelize) {
    return sequelize.define("comment", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        categorie:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        timestamps: false
    })
}