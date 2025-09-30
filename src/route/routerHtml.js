import express from "express"
import sendFile from "./../service/sendFile.js";

const router = express.Router()





//Router page html
router.get("/index", (req, res) => {
    sendFile("./public/pageHtml/index.html", res);
})


router.get("/connection", (req, res) => {
    sendFile("./public/pageHtml/connection.html", res);
})

router.get("/dashboard", (req, res) => {
    sendFile("./public/pageHtml/dashboard.html", res);
})

router.get("/mon-compte", (req, res) => {
    sendFile("./public/pageHtml/configCompte.html", res);
})

router.get("/services", (req, res) => {
    sendFile("./public/pageHtml/services.html", res);
})

router.get("/event", (req, res) => {
    sendFile("./public/pageHtml/event.html", res);
})


//export à la fin du fichier
export default router