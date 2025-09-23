import user from "./../models/utilisateur.js"

export default async function getUserData(req, db, res) {
    const User = user(db);

    const userId = req.userId;
    const data = await User.findByPk(userId);
    console.log(data)


         res.json({
            message: "Donnée de l'utilisateur",
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            mdp: data.mdp,
            raisonSocial: data.raisonSocial,
            siren: data.siren,
        }) 
}