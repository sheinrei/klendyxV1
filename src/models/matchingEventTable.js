import { DataTypes, UniqueConstraintError } from "sequelize"


export function matchingEventTable(sequelize) {
    return sequelize.define("matchingEvent", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idUser: {
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
        }


    }, {
        sequelize,
        timestamps: true,
        updatedAt: false,
    })
}