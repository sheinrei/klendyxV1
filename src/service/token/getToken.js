import tokenTable from "../../models/tokenTable.js";


export async function getToken(type, userId, db) {

    const Token = tokenTable(db);

    const saved = await Token.findOne({
        where: { idUser: userId, type }
    });

    if (!saved) return { success: false, message: "Pas de token trouvé" };
    const tokenData = JSON.parse(saved.dataValues.token);

    return {
        success: true,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expiry_date: tokenData.expiry_date,
        totalToken: tokenData,
        createdAt: saved.createdAt
    };
}



export async function getAllToken(db) {


    try {
        const Token = tokenTable(db);

        const tokens = await Token.findAll();

        return{
            success:true,
            data:tokens
        }
    } catch (err) {
        console.warn("Une erreur est survenue lors de la récupération de tout les tokens")
        return{
            success:false
        }
    }
}