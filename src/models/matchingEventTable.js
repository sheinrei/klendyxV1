import { DataTypes } from "sequelize"


export function matchingEventTable(sequelize) {
    return sequelize.define("matchingEvent", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        eventTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        eventAddress: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        contact: {
            type: DataTypes.JSON,
            defaultValue: [],
            allowNull: false,
        },

        rangeStart: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        rangeEnd: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        rangeHoursStart: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rangeHoursEnd: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },


        durationEvent: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        undisponibility: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        },

        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        resolve: {
            type: DataTypes.JSON,
            allowNull: true,
        }


    }, {
        sequelize,
        timestamps: true,
        updatedAt: false,
    })
}