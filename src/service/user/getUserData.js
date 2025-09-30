import user from "../../models/utilisateurTable.js"

export async function getUserData(req, db, res) {


    const User = user(db);

    const userId = req.userId;
    const data = await User.findByPk(userId);

    res.json({
        message: "Donnée de l'utilisateur",
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        mdp: data.mdp,
        raisonSocial: data.raisonSocial,
        siren: data.siren,
        created: data.createdAt,
    })
}

export async function getIdByEmail(email, db) {

    const User = user(db);

    const data = await User.findOne({
        where: { email: email }
    })

    const id = data.id;
    return id
}