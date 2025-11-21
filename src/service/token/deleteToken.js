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
        console.log("Token effacé")
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