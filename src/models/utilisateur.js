
import { DataTypes } from "sequelize"
/**
 * Table utilisateur
 * user()
 */

export default (sequelize) => {
    return sequelize.define("utilisateur", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
            unique: true
        },
        mdp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        raisonSocial: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        siren: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        abonnement: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "utilisateur"
        },
        isVerified:{
            type:DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: Boolean(false)
        }
    })
}