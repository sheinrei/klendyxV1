import express from "express"
import sendFile from "./../service/sendFile.js";

const router = express.Router()

router.get("/", (req, res) => {
    res.redirect("/index")
})


//Router page html
router.get("/index", (req, res) => {
    sendFile("./public/pageHtml/index.html", res);
})


router.get("/connexion", (req, res) => {
    sendFile("./public/pageHtml/connexion.html", res);
})


router.get("/dashboard", (req, res) => {
    sendFile("./public/pageHtml/dashboard.html", res);
})



router.get("/forgotPassword", (req, res) => {
    sendFile("./public/pageHtml/forgotPassword.html", res);
})

router.get("/user-verify/:token/:id", (req, res) => {
    sendFile("./public/pageHtml/userVerify.html", res)
})


router.get("/contact", (req, res) => {
    sendFile("./public/pageHtml/contact.html", res);
})


router.get("/creer-rdv", (req, res) => {
    sendFile("./public/pageHtml/createRdv.html", res);
})

router.get("/valider-rdv/:token/:id/:idEvent", (req, res) => {
    sendFile("./public/pageHtml/reponsePropositionRdv.html", res)
})

router.get("/agenda", (req, res) => {
    sendFile("./public/pageHtml/agenda.html", res);
})


router.get("/mon-compte", (req, res) => {
    sendFile("./public/pageHtml/parametreCompte.html", res);
})


router.get("/contacts-favoris", (req, res) => {
    sendFile("./public/pageHtml/contactFavori.html", res);
})

router.get("/matching-rdv/:token/:origin", (req, res) => {
    sendFile("./public/pageHtml/matchingEvent.html", res);
})

router.get("/matching-rdv/validate", (req, res) => {
    sendFile("./public/pageHtml/matchingEventValidate.html", res)
})

router.get("/confidentialite", (req, res) => {
    sendFile("./public/pageHtml/confidentialite.html", res);
})

router.get("/condition-utilisation", (req, res) => {
    sendFile("./public/pageHtml/conditionUtilisation.html", res);
})

//export à la fin du fichier
export default router