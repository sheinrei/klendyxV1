import DataTypes from "sequelize"


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
        plan: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Essais gratuit",
        },
        refreshAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        },
        sms: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        mail: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 40,

        },
    }, {
        timestamps: true,
        paranoid: false,
        deletedAt: false
    })
}