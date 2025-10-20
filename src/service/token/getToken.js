import tokenTable from "../../models/tokenTable.js";


export async function getToken(type, userId, db) {
    const Token = tokenTable(db);

    const saved = await Token.findOne({
        where: { idUser: userId, type }
    });

    if (!saved) return {success:false, message:"Pas de token trouvé"};
    const tokenData = JSON.parse(saved.dataValues.token);

    return {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token
    };
}