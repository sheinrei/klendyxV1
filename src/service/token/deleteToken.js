import tokenTable from "./../../models/tokenTable.js"



export async function deleteToken(token, db) {
    try {
        const Token = tokenTable(db);
        const deletedToken = await Token.destroy({
            where: { token }
        })
        if (!deletedToken) {
            return {
                success: false,
                message: `Token : ${token} n'as pas pu être supprimé`
            }
        }
        return {
            success: true,
            message: `Token : ${token} supprimé avec succès`
        }
    } catch (err) {
        console.warn(`Une erreur est survenue lors de la suppression d'un token, error : ${err}`)
        return {
            success: false,
            error: err,
            message: "Une erreur est survenue lors de la suppression d'un token"
        }
    }
}


export async function deleteTokenSyncCalendar(db, userId, provider) {
    try {
        const Token = tokenTable(db);
        const deletedToken = await Token.destroy({
            where: {
                userId: userId,
                type: `${provider}Sync`
            }
        })
        console.log(deletedToken);
        if (deletedToken > 0) {
            return {
                success: true,
                message: `La synchronisation avec votre agenda ${provider} a été révoqué avec succès`
            }
        }

        if (deletedToken == 0) {
            return {
                success: false,
                message: `La révoquation de votre agenda ${provider} a échoué, aucune synchronisation trouvée`
            }
        }

    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: `"Une erreur est survenue lors de la suppression de la synchronisation avec votre agenda ${provider} , veuillez réessayer plus tard, si le problème persiste merci de contacter notre support`,
            error: err.message
        }
    }
}

export async function deleteAllUserTokenByType(db, userId, type) {
    try {
        const Token = tokenTable(db);
        const deletedToken = await Token.destroy({
            where: {
                userId: userId,
                type: type
            },
        })
        console.log(deletedToken);
        if (deletedToken > 0) {
            return {
                success: true,
            }
        }

        if (deletedToken == 0) {
            return {
                success: false,
            }
        }

    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: `"Une erreur est survenue lors de la suppression de token', veuillez réessayer plus tard, si le problème persiste merci de contacter notre support`,
            error: err.message
        }
    }
}