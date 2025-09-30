import tokenTable from "./../../models/tokenTable.js"

export async function deleteToken(token, db) {

    const Token = tokenTable(db);
    const deletedToken = await Token.destroy({
        where: {
            token: token
        }
    })

    if (deletedToken) {
        console.log("Token effacé")
    }
}