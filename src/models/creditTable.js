import DataTypes from "sequelize"

const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

export function creditTable(sequelize) {
    return sequelize.define("credit", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        plan : {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Free",
        },
        refreshAt:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: nextWeek
        },
        sms: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue : 5,
        },
        mail : {
            type: DataTypes.INTEGER,
            allowNull : false,
            defaultValue: 40,

        },
    },{
        timestamps: true,
        paranoid:false,
        deletedAt: false
    })
}