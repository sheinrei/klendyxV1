import express from "express";
const routerApiContactFav = express.Router()

import db from "./../sequelize.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createContactFav } from "../service/contactFav/createContactFav.js";
import { getContactFav } from "../service/contactFav/getContactFav.js";
import { updateContactFav } from "../service/contactFav/updateContactFav.js";
import { deleteContactFav } from "../service/contactFav/deleteContactFav.js";




routerApiContactFav.post("/create",authMiddleware, async (req, res) => {
    console.log("create");
    createContactFav(db,req);
})


routerApiContactFav.get("/get",authMiddleware,  async (req, res) => {
    console.log("get");
    getContactFav(db, req);
})


routerApiContactFav.post("/update",authMiddleware,  async (req, res) => {
    console.log("update");
    updateContactFav(db, req);
})


routerApiContactFav.post("/delete",authMiddleware,  async (req, res) => {
    console.log("delete");
    deleteContactFav(db, req)
})


export default routerApiContactFav