import { google } from 'googleapis';

export async function addNewEventGoogle(tokenGoogle, dataEvent, req) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.O2AUTH_ID_CLIENT,
        process.env.O2AUTH_CLIENT_SECRET,
        `${process.env.HOST}/api/calendar/oauth2callback`
    );

    oauth2Client.setCredentials(tokenGoogle);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const event = {
        summary: dataEvent.data.eventTitle,
        location: 'Google Meet',
        description: dataEvent.data.description,
        start: {
            dateTime: req.body.dateStart,
            timeZone: 'Europe/Paris',
        },
        end: {
            dateTime: req.body.dateEnd,
            timeZone: 'Europe/Paris',
        },
    };

    try {
        const eventRes = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
        const googleEventId = eventRes.data.id;
        return { success: true, data: eventRes.data, id: googleEventId };
    } catch (err) {
        console.error(err);
        return { success: false, error: err };
    }
}
