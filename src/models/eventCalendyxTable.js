import DataTypes from "sequelize"


export function eventCalendyxTable(sequelize) {
    return sequelize.define("eventCalendyx", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        summary : {
            type : DataTypes.STRING,
            allowNull : false
        },
        describe : {
            type : DataTypes.TEXT,
            allowNull : true,
        },
        image : {
            type : DataTypes.STRING,
            allowNull : true
        },
        hourStart : {
            type : DataTypes.DATE,
            allowNull : false,
        },
        hourEnd : {
            type : DataTypes.DATE,
            allowNull: false
        },
        allDay : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },


    },{
        timestamps: true,
        paranoid:false,
        deletedAt: false
    })
}