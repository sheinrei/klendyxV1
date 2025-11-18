import express from "express";
import OpenAI from "openai";

const routerApiGpt = express.Router();

routerApiGpt.post("/prompt", async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = "Peut tu m'estimer combien de token ça depenserai le traitement d'un json de 200 lignes pour match des rdv selon plusieurs user?";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    console.log(response)
    console.log("message de retour de gpt : ",content);

    res.json({ success: true, content });
  } catch (err) {
    console.error("Erreur OpenAI :", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default routerApiGpt;