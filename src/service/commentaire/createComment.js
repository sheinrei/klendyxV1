import { commentTable } from "../../models/commentTable.js";


export async function createComment(req, db) {

    try {
        const Commentaire = commentTable(db);

        const newComment = await Commentaire.create({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            categorie: req.body.categorie,
            commentaire: req.body.commentaire
        })

        if(newComment){
            return {success:true, message:"Votre commentaire à bien été déposé. \n L’équipe Klendyx mettra tout en œuvre pour vous répondre dans les plus brefs délais."}
        }
    } catch (err) {
        console.log('Erreur lors de l\'enregistrement du commentaire', err)
    }
}