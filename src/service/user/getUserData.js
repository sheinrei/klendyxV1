import user from "../../models/utilisateurTable.js"

export async function getUserData(req = null, db, id) {
    const User = user(db);
    const userId = req?.userId ?? id;
    const data = await User.findByPk(userId);
    
    return data
}


export async function getIdByEmail(email, db) {
    const User = user(db);
    const data = await User.findOne({
        where: { email: email }
    })
    const id = data.id;
    return id
}