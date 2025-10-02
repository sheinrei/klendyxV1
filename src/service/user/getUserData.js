import user from "../../models/utilisateurTable.js"

export async function getUserData(req, db, res) {


    const User = user(db);

    const userId = req.userId;
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