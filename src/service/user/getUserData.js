import user from "../../models/utilisateurTable.js"

export async function getUserData(db, id) {
    const User = user(db);
    const data = await User.findByPk(id);
    
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