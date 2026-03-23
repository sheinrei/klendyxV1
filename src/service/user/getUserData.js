import user from "../../models/utilisateurTable.js"

export async function getUserData(db, id) {
    try {
        const User = user(db);
        const data = await User.findByPk(id);

        return data
    } catch (err) {
        console.error(err)
        return {
            success: false,
            message: "Une erreur est survenue lors de la récupération des données de l'utilisateur"
        }
    }
}


export async function getIdByEmail(email, db) {
    const User = user(db);
    const data = await User.findOne({
        where: { email: email }
    })
    const id = data.id;
    return id
}