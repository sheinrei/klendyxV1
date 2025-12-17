import tokenTable from "./../../models/tokenTable.js"

export async function deleteTokenAccessGoogle(idUser, db) {

    const Token = tokenTable(db);
    const deletedToken = await Token.destroy({
        where: {
            type: "RefreshTokenGoogle",
            idUser
        }
    })

    if (deletedToken) {
        return ({success:true, message : "La synchronisation de votre compte google a été supprimer"})
    }
}

export async function deleteToken(token, db) {
    const Token = tokenTable(db);
    const deletedToken = await Token.destroy({
        where: { token }
    })
    if (deletedToken) {
        console.log("Token effacé")
    }
}

export async function deleteTokenSyncCalendar(db, userId, provider){
    const Token = tokenTable(db);
    const deletedToken = await Token.destroy({
        where : {
            idUser : userId,
            type : `${provider}Sync`
        }
    })

    
}