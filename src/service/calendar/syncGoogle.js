import { google } from "googleapis";



const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];

const authUrl = oauth2Client.
generateAuthUrl({
  access_type: "offline", // pour obtenir un refresh_token
  scope: scopes,
});

console.log("Autorise l’app en visitant :", authUrl);



app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // ici tu peux stocker les tokens (dans ta DB par ex)
  console.log("Tokens récupérés :", tokens);

  res.send("Connexion réussie !");
});


const calendar = google.calendar({ version: "v3", auth: oauth2Client });

const events = await calendar.events.list({
  calendarId: "primary",
  timeMin: new Date().toISOString(),
  maxResults: 10,
  singleEvents: true,
  orderBy: "startTime",
});

console.log("Événements à venir :", events.data.items);
