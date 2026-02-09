import express from "express";
const routerApiPayment = express.Router()
import Stripe from "stripe";
//securité
import authMiddleware from "../middleware/authMiddleware.js";

//instance bdd
import db from "../sequelize.js";


routerApiPayment.post("/create", authMiddleware, async (req, res) => {


    try {
        const { amount } = req.body;
        const userId = req.userId;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Aucun montant n'est séléctionné"
            });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // en centimes (ex: 999 = 9.99€)
            currency: "eur",
            automatic_payment_methods: {
                enabled: true,
            },
        });

    } catch (err) {
        console.log("Erreur lors de la creation d'un payment")
        return res.status(500).json({
            success: false,
            message: "Une erreur est survenue avec le serveur, veuillez réessayer plus tard. Si le problème persiste merci de contacter notre service technique."
        })
    }
})

routerApiPayment.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (req, res) => {
        const sig = req.headers["stripe-signature"];

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("Webhook signature failed.", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            console.log("✅ Payment succeeded:", paymentIntent.id);
            // TODO: marquer la commande comme payée en DB
        }

        res.json({ received: true });
    }
);

export default routerApiPayment