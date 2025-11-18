const contact2 = ["l.beaute@laposte.net"]
const dayStart2 = "2025-11-07 02:00:00"
const dayEnd2 = "2025-11-30 02:00:00"
const timeRdv = 1; // Durée du RDV en heures
const hoursStart = 8; //heure formaté jsute en number
const hoursEnd = 20; //heure formaté jsute en number


const data2 = {
  "origin": {
    "validate": true,
    "disponible": [],
    "indisponible": [
      { "start": "2025-11-07T09:00:00+01:00", "end": "2025-11-07T12:00:00+01:00" },
      { "start": "2025-11-07T13:00:00+01:00", "end": "2025-11-07T14:30:00+01:00" },
      { "start": "2025-11-07T14:45:00+01:00", "end": "2025-11-07T16:45:00+01:00" },
      { "start": "2025-11-07T19:00:00+01:00", "end": "2025-11-07T20:00:00+01:00" },
      { "start": "2025-11-08T10:45:00+01:00", "end": "2025-11-08T11:30:00+01:00" },
      { "start": "2025-11-08T13:00:00+01:00", "end": "2025-11-08T13:05:00+01:00" },
      { "start": "2025-11-08T19:00:00+01:00", "end": "2025-11-08T20:00:00+01:00" },
      { "start": "2025-11-09T19:00:00+01:00", "end": "2025-11-09T20:00:00+01:00" },
      { "start": "2025-11-10T09:00:00+01:00", "end": "2025-11-10T11:00:00+01:00" },
      { "start": "2025-11-10T11:10:00+01:00", "end": "2025-11-10T13:10:00+01:00" },
      { "start": "2025-11-10T14:00:00+01:00", "end": "2025-11-10T16:00:00+01:00" },
      { "start": "2025-11-10T19:00:00+01:00", "end": "2025-11-10T20:00:00+01:00" },
      { "start": "2025-11-11T19:00:00+01:00", "end": "2025-11-11T20:00:00+01:00" },
      { "start": "2025-11-12T09:00:00+01:00", "end": "2025-11-12T11:00:00+01:00" },
      { "start": "2025-11-12T19:00:00+01:00", "end": "2025-11-12T20:00:00+01:00" },
      { "start": "2025-11-13T09:00:00+01:00", "end": "2025-11-13T12:00:00+01:00" },
      { "start": "2025-11-13T13:00:00+01:00", "end": "2025-11-13T16:00:00+01:00" },
      { "start": "2025-11-13T19:00:00+01:00", "end": "2025-11-13T20:00:00+01:00" },
      { "start": "2025-11-14T10:30:00+01:00", "end": "2025-11-14T11:30:00+01:00" },
      { "start": "2025-11-14T19:00:00+01:00", "end": "2025-11-14T20:00:00+01:00" },
      { "start": "2025-11-15T19:00:00+01:00", "end": "2025-11-15T20:00:00+01:00" },
      { "start": "2025-11-16T19:00:00+01:00", "end": "2025-11-16T20:00:00+01:00" },
      { "start": "2025-11-17T09:00:00+01:00", "end": "2025-11-17T11:00:00+01:00" },
      { "start": "2025-11-17T11:10:00+01:00", "end": "2025-11-17T13:10:00+01:00" },
      { "start": "2025-11-17T14:00:00+01:00", "end": "2025-11-17T16:00:00+01:00" },
      { "start": "2025-11-17T19:00:00+01:00", "end": "2025-11-17T20:00:00+01:00" },
      { "start": "2025-11-18T09:00:00+01:00", "end": "2025-11-18T11:00:00+01:00" },
      { "start": "2025-11-18T11:05:00+01:00", "end": "2025-11-18T12:05:00+01:00" },
      { "start": "2025-11-18T12:45:00+01:00", "end": "2025-11-18T14:45:00+01:00" },
      { "start": "2025-11-18T15:00:00+01:00", "end": "2025-11-18T17:00:00+01:00" },
      { "start": "2025-11-18T19:00:00+01:00", "end": "2025-11-18T20:00:00+01:00" },
      { "start": "2025-11-19T09:00:00+01:00", "end": "2025-11-19T11:00:00+01:00" },
      { "start": "2025-11-19T13:30:00+01:00", "end": "2025-11-19T14:30:00+01:00" },
      { "start": "2025-11-19T19:00:00+01:00", "end": "2025-11-19T20:00:00+01:00" },
      { "start": "2025-11-20T09:00:00+01:00", "end": "2025-11-20T12:00:00+01:00" },
      { "start": "2025-11-20T13:00:00+01:00", "end": "2025-11-20T16:00:00+01:00" },
      { "start": "2025-11-20T19:00:00+01:00", "end": "2025-11-20T20:00:00+01:00" },
      { "start": "2025-11-21T09:00:00+01:00", "end": "2025-11-21T12:00:00+01:00" },
      { "start": "2025-11-21T13:00:00+01:00", "end": "2025-11-21T14:30:00+01:00" },
      { "start": "2025-11-21T14:45:00+01:00", "end": "2025-11-21T16:45:00+01:00" },
      { "start": "2025-11-21T19:00:00+01:00", "end": "2025-11-21T20:00:00+01:00" },
      { "start": "2025-11-22T19:00:00+01:00", "end": "2025-11-22T20:00:00+01:00" },
      { "start": "2025-11-23T19:00:00+01:00", "end": "2025-11-23T20:00:00+01:00" },
      { "start": "2025-11-24T09:00:00+01:00", "end": "2025-11-24T11:00:00+01:00" },
      { "start": "2025-11-24T11:10:00+01:00", "end": "2025-11-24T13:10:00+01:00" },
      { "start": "2025-11-24T14:00:00+01:00", "end": "2025-11-24T16:00:00+01:00" },
      { "start": "2025-11-24T19:00:00+01:00", "end": "2025-11-24T20:00:00+01:00" },
      { "start": "2025-11-25T09:00:00+01:00", "end": "2025-11-25T11:00:00+01:00" },
      { "start": "2025-11-25T11:05:00+01:00", "end": "2025-11-25T12:05:00+01:00" },
      { "start": "2025-11-25T12:45:00+01:00", "end": "2025-11-25T14:45:00+01:00" },
      { "start": "2025-11-25T15:00:00+01:00", "end": "2025-11-25T17:00:00+01:00" },
      { "start": "2025-11-25T19:00:00+01:00", "end": "2025-11-25T20:00:00+01:00" },
      { "start": "2025-11-26T09:00:00+01:00", "end": "2025-11-26T11:00:00+01:00" },
      { "start": "2025-11-26T19:00:00+01:00", "end": "2025-11-26T20:00:00+01:00" },
      { "start": "2025-11-27T09:00:00+01:00", "end": "2025-11-27T12:00:00+01:00" },
      { "start": "2025-11-27T13:00:00+01:00", "end": "2025-11-27T16:00:00+01:00" },
      { "start": "2025-11-27T19:00:00+01:00", "end": "2025-11-27T20:00:00+01:00" },
      { "start": "2025-11-28T09:00:00+01:00", "end": "2025-11-28T12:00:00+01:00" },
      { "start": "2025-11-28T13:00:00+01:00", "end": "2025-11-28T14:30:00+01:00" },
      { "start": "2025-11-28T14:45:00+01:00", "end": "2025-11-28T16:45:00+01:00" },
      { "start": "2025-11-28T18:00:00+01:00", "end": "2025-11-28T18:10:00+01:00" },
      { "start": "2025-11-28T19:00:00+01:00", "end": "2025-11-28T20:00:00+01:00" },
      { "start": "2025-11-29T19:00:00+01:00", "end": "2025-11-29T20:00:00+01:00" }
    ],
    "preference": []
  },
  "l.beaute@laposte.net": {
    "validate": true,
    "disponible": [
      { "start": "2025-11-13T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-12T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-19T23:00:00.000Z", "end": null, "allDay": true }
    ],
    "indisponible": [
      { "start": "2025-11-08T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-15T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-22T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-29T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-07T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-14T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-21T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-28T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-25T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-06T23:00:00.000Z", "end": null, "allDay": true }
    ],
    "preference": [
      { "start": "2025-11-11T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-18T23:00:00.000Z", "end": null, "allDay": true },
      { "start": "2025-11-10T07:00:00.000Z", "end": "2025-11-10T11:00:00.000Z", "allDay": false },
      { "start": "2025-11-11T07:00:00.000Z", "end": "2025-11-11T11:00:00.000Z", "allDay": false },
      { "start": "2025-11-17T07:00:00.000Z", "end": "2025-11-17T11:00:00.000Z", "allDay": false },
      { "start": "2025-11-18T07:00:00.000Z", "end": "2025-11-18T11:00:00.000Z", "allDay": false },
      { "start": "2025-11-24T07:00:00.000Z", "end": "2025-11-24T11:00:00.000Z", "allDay": false },
      { "start": "2025-11-25T07:00:00.000Z", "end": "2025-11-25T11:00:00.000Z", "allDay": false },
      { "start": "2025-11-13T11:00:00.000Z", "end": "2025-11-13T16:00:00.000Z", "allDay": false },
      { "start": "2025-11-20T11:00:00.000Z", "end": "2025-11-20T16:00:00.000Z", "allDay": false },
      { "start": "2025-11-27T11:00:00.000Z", "end": "2025-11-27T16:00:00.000Z", "allDay": false }
    ]
  }
}


function searchAllDaysInterval(start, end) {
  const dayInInterval = [];
  console.log({
    start: typeof (start),
    end
  })
  const startDate = new Date(start.split(' ')[0]);
  const endDate = new Date(end.split(" ")[0]);
  const date = new Date(startDate);

  while (date <= endDate) {
    dayInInterval.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() + 1);
  }

  return dayInInterval;
}

function dropIndispoDays(contacts, dayInInterval, data) {
  const arrayIndisponibleAllDay = new Set();

  contacts.forEach(contact => {
    const arrayIndispo = data[contact].indisponible;
    arrayIndispo.forEach((e) => {
      if (e.allDay === true) {
        arrayIndisponibleAllDay.add(e.start.split("T")[0]);
      }
    });
  });

  return dayInInterval.filter(current => ![...arrayIndisponibleAllDay].includes(current));
}

function parseTime(timeStr) {
  // Gère différents formats: "09:00:00+01:00" ou "09:00:00"
  const timePart = timeStr.split('+')[0].split('-')[0];
  const [hours, minutes] = timePart.split(':').map(Number);
  return hours + minutes / 60;
}

function findAvailableSlots(dayData, timeRdvInHours, hoursStart = 8, hoursEnd = 20) {
  const slots = [];
  // Trier les events par heure de début
  const sortedEvents = [...dayData.events].sort((a, b) =>
    parseTime(a.start) - parseTime(b.start)
  );

  let currentTime = hoursStart;

  sortedEvents.forEach(event => {
    const eventStartTime = parseTime(event.start);
    const eventEndTime = parseTime(event.end);

    // Créneaux avant cet event
    while (currentTime + timeRdvInHours <= eventStartTime) {
      const slotStart = currentTime;
      const slotEnd = currentTime + timeRdvInHours;

      slots.push({
        start: `${String(Math.floor(slotStart)).padStart(2, '0')}:${String(Math.round((slotStart % 1) * 60)).padStart(2, '0')}:00`,
        end: `${String(Math.floor(slotEnd)).padStart(2, '0')}:${String(Math.round((slotEnd % 1) * 60)).padStart(2, '0')}:00`,
        startDecimal: slotStart,
        endDecimal: slotEnd
      });

      currentTime += 0.25; // Incrément de 15 minutes
    }

    currentTime = Math.max(currentTime, eventEndTime);
  });

  // Créneaux après le dernier event
  while (currentTime + timeRdvInHours <= hoursEnd) {
    const slotStart = currentTime;
    const slotEnd = currentTime + timeRdvInHours;

    slots.push({
      start: `${String(Math.floor(slotStart)).padStart(2, '0')}:${String(Math.round((slotStart % 1) * 60)).padStart(2, '0')}:00`,
      end: `${String(Math.floor(slotEnd)).padStart(2, '0')}:${String(Math.round((slotEnd % 1) * 60)).padStart(2, '0')}:00`,
      startDecimal: slotStart,
      endDecimal: slotEnd
    });

    currentTime += 0.25;
  }

  return slots;
}

function isInPreferenceRange(slot, preferences, dayDate) {
  return preferences.some(pref => {
    // Vérifier que la préférence est pour ce jour
    const prefDate = pref.start.split("T")[0];
    if (prefDate !== dayDate) return false;

    if (pref.allDay) {
      return true;
    }

    const prefStart = new Date(pref.start);
    const prefEnd = new Date(pref.end);
    const prefStartTime = prefStart.getUTCHours() + prefStart.getUTCMinutes() / 60;
    const prefEndTime = prefEnd.getUTCHours() + prefEnd.getUTCMinutes() / 60;

    return slot.startDecimal >= prefStartTime && slot.endDecimal <= prefEndTime;
  });
}

function calculateDayScore(day, structureDays, timeRdv, allPreferences, hoursStart, hoursEnd) {
  let score = 0;
  const dayData = structureDays[day];

  // 1. BONUS pour préférences
  dayData.preference.forEach(pref => {
    if (pref.allDay) {
      score += 50;
    } else {
      score += 30;
    }
  });

  // 2. MALUS pour temps occupé
  dayData.events.forEach(event => {
    score -= event.time * 2;
  });

  // 3. Trouver les créneaux disponibles
  const availableSlots = findAvailableSlots(dayData, timeRdv, hoursStart, hoursEnd);
  score += availableSlots.length * 5;

  // 4. BONUS pour créneaux dans les préférences
  const slotsInPreference = availableSlots.filter(slot =>
    isInPreferenceRange(slot, allPreferences, day)
  );
  score += slotsInPreference.length * 20;

  return { score, availableSlots, slotsInPreference };
}






function matching(contacts, data, rangeStart, rangeEnd, timeRdv, hoursStart, hoursEnd) {
  // 1. Récupérer tous les jours de l'intervalle
  const dayInInterval = searchAllDaysInterval(rangeStart, rangeEnd);

  // 2. Ajouter "origin" aux contacts
  const allContacts = [...contacts, "origin"];

  // 3. Retirer les jours indisponibles (allDay)
  const arrayDaysValide = dropIndispoDays(allContacts, dayInInterval, data);

  // 4. Créer la structure pour chaque jour
  const structureDays = {};
  arrayDaysValide.forEach((day) => {
    structureDays[day] = {
      events: [],
      preference: [],
      score: 0,
      availableSlots: [],
      slotsInPreference: []
    };
  });


  // 5. Collecter toutes les préférences
  const allPreferences = [];
  allContacts.forEach((contact) => {
    data[contact].preference.forEach(pref => allPreferences.push(pref));
  });

  // 6. Hydrater structureDays avec les préférences et événements
  allContacts.forEach((contact) => {
    // Ajouter les préférences
    data[contact].preference.forEach((pref) => {
      const date = pref.start.split("T")[0];
      if (structureDays[date]) {
        structureDays[date].preference.push(pref);
      }
    });

    // Ajouter les événements qui rendent indispo
    data[contact].indisponible.forEach((indispo) => {
      if (!indispo.allDay) {
        const date = indispo.start.split("T")[0];
        if (structureDays[date]) {
          const startTime = parseTime(indispo.start.split("T")[1]);
          const endTime = parseTime(indispo.end.split("T")[1]);
          const duration = endTime - startTime;

          structureDays[date].events.push({
            start: indispo.start.split("T")[1],
            end: indispo.end.split("T")[1],
            time: duration,
            user: contact
          });
        }
      }
    });
  });


  // 7. Calculer les scores pour chaque jour
  const dayScores = [];

  arrayDaysValide.forEach((day) => {
    const result = calculateDayScore(day, structureDays, timeRdv, allPreferences, hoursStart, hoursEnd);
    structureDays[day].score = result.score;
    structureDays[day].availableSlots = result.availableSlots;
    structureDays[day].slotsInPreference = result.slotsInPreference;

    dayScores.push({
      day,
      score: result.score,
      nbSlots: result.availableSlots.length,
      nbPreferenceSlots: result.slotsInPreference.length
    });
  });


  // 8. Trouver le meilleur jour
  dayScores.sort((a, b) => b.score - a.score);
  const bestDay = dayScores[0].day;
  const bestDayData = structureDays[bestDay];

  // 9. Choisir la meilleure heure
  let bestSlot = null;

  if (bestDayData.slotsInPreference.length > 0) {
    // Priorité aux créneaux dans les préférences
    bestSlot = bestDayData.slotsInPreference[0];
  } else if (bestDayData.availableSlots.length > 0) {
    // Sinon, premier créneau disponible
    bestSlot = bestDayData.availableSlots[0];
  }

  if (!bestSlot) {
    console.log(`Pas de best slot trouvé ! : `, bestDayData)
  }


  return {
    bestDay,
    bestSlot,
    score: bestDayData.score,
    allDayScores: dayScores,
    dayData: bestDayData
  };
}

// ===== EXÉCUTION =====
const result = matching(contact2, data2, dayStart2, dayEnd2, timeRdv);
console.log(result.bestDay)
console.log(result.bestSlot)

[{
  "date": "2025-11-12", "dayScore": "216.3",
  "slots": [{ "start": "12/11/2025", "end": "12/11/2025", "hour": 10, "minute": 0, "score": 0, "prefCount": 0, "timePenalty": 0, "period": "matin" },
  { "start": "12/11/2025", "end": "12/11/2025", "hour": 15, "minute": 0, "score": 0, "prefCount": 0, "timePenalty": 0, "period": "après-midi" }]
},
{
  "date": "2025-11-18", "dayScore": "85.1",
  "slots": [{ "start": "18/11/2025", "end": "18/11/2025", "hour": 10, "minute": 0, "score": 0, "prefCount": 0, "timePenalty": 0, "period": "matin" },
  { "start": "18/11/2025", "end": "18/11/2025", "hour": 15, "minute": 0, "score": 0, "prefCount": 0, "timePenalty": 0, "period": "après-midi" }]
},
  {
    "date": "2025-11-21", "dayScore": "25.9",
    "slots": [{ "start": "21/11/2025", "end": "21/11/2025", "hour": 10, "minute": 0, "score": 0, "prefCount": 0, "timePenalty": 0, "period": "matin" },
    { "start": "21/11/2025", "end": "21/11/2025", "hour": 15, "minute": 0, "score": 0, "prefCount": 0, "timePenalty": 0, "period": "après-midi" }]
  }]

