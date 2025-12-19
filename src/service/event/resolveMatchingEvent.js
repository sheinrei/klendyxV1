function searchAllDaysInterval(start, end) {
    const dayInInterval = [];
    const startDate = new Date(start.split("T")[0]);
    const endDate = new Date(end.split("T")[0]);
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

function calculeTimeDiff(start, end) {
    const started = new Date(start);
    const ending = new Date(end);
    const diffMiliSeconde = ending - started;
    return diffMiliSeconde / (1000 * 60 * 60);
}

function hydraterStructureDays(structureDays, contact, data, plageHoraire) {
    const structure = structureDays;
    contact.forEach((contact) => {
        const indispo = data[contact].indisponible;
        indispo.forEach((e) => {
            if (!e.allDay) {
                const date = e.start.split("T")[0];
                if (structureDays[date]) {
                    structureDays[date].events.push({
                        start: e.start,
                        end: e.end,
                        time: calculeTimeDiff(e.start, e.end)
                    });
                }
            }
        });

        const preference = data[contact].preference;
        preference.forEach((e) => {
            const date = e.start.split("T")[0];
            if (structureDays[date] && !e.allDay) {
                structureDays[date].preference.push({
                    start: e.start,
                    end: e.end,
                    user: contact,
                    time: calculeTimeDiff(e.start, e.end)
                });
            }
            if (structureDays[date] && e.allDay) {
                structureDays[date].preference.push({ user: contact, time: plageHoraire });
            }
        });
    });
    return structure;
}

function dynamicCoefScoring(totalTimePref, totalTimeEvent, plageHoraire) {
    const total = totalTimePref + totalTimeEvent;
    const ratioPref = totalTimePref / total || 1;
    const coefBonus = Math.min(1 + ratioPref, 2);
    const coefSurcharge = Math.min(1 + (totalTimeEvent / plageHoraire), 2);
    return { coefBonus, coefSurcharge };
}

function calculeScoring(structure, arrayDaysValid, plageHoraire) {
    const structureScored = structure;
    arrayDaysValid.forEach((day) => {
        let totalTimePref = 0;
        let totalTimeEvent = 0;

        structureScored[day].events.forEach((event) => { totalTimeEvent += event.time; });
        structureScored[day].preference.forEach((pref) => { totalTimePref += pref.time; });

        const { coefBonus, coefSurcharge } = dynamicCoefScoring(totalTimePref, totalTimeEvent, plageHoraire);
        const score = (totalTimePref * coefBonus - totalTimeEvent * coefSurcharge);
        structureScored[day].score = ((score / plageHoraire) * 100).toFixed(1);
    });
    return structureScored;
}

function selectBestDayScoring(structure, numberReturn, arrayDaysValid) {
    const arrayScore = [];
    const bestDays = [];
    arrayDaysValid.forEach(day => arrayScore.push(structure[day].score));
    arrayScore.sort((a, b) => b - a).splice(numberReturn);
    arrayDaysValid.forEach(day => {
        if (arrayScore.includes(structure[day].score)) {
            bestDays.push({ date: day, data: structure[day] });
        }
    });
    return bestDays;
}

function findAvailableSlots(events, timeRdv, hoursStart, hoursEnd, date) {
    const slots = [];
    const allPossibleSlots = [];

    for (let hour = hoursStart; hour < hoursEnd; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {

            // Création locale (corrige le décalage UTC)
            const slotStart = new Date(date);
            slotStart.setHours(hour, minute, 0, 0);

            const slotEnd = new Date(slotStart.getTime() + timeRdv * 60 * 60 * 1000);
            //console.log("Créneau :", slotStart.toLocaleString(), "→", slotEnd.toLocaleString());

            if (slotEnd.getHours() < hoursEnd || (slotEnd.getHours() === hoursEnd && slotEnd.getMinutes() === 0)) {
                allPossibleSlots.push({
                    start: slotStart.toISOString(),
                    end: slotEnd.toISOString(),
                    hour,
                    minute
                });
            }
        }
    }

    allPossibleSlots.forEach(slot => {
        let isAvailable = true;
        for (const event of events) {
            if (slotsOverlap(slot, event)) {
                isAvailable = false;
                break;
            }
        }
        if (isAvailable) slots.push(slot);
    });

    return slots;
}

function slotsOverlap(slot1, slot2) {
    const start1 = new Date(slot1.start).getTime();
    const end1 = new Date(slot1.end).getTime();
    const start2 = new Date(slot2.start).getTime();
    const end2 = new Date(slot2.end).getTime();

    return start1 < end2 && end1 > start2;
}

function calculateOverlap(slot, preference) {
    // Si pas de start/end défini dans la préférence (allDay)
    if (!preference.start || !preference.end) {
        return slot.hour >= 8 && slot.hour < 20
            ? (new Date(slot.end) - new Date(slot.start)) / (1000 * 60 * 60)
            : 0;
    }

    const slotStart = new Date(slot.start).getTime();
    const slotEnd = new Date(slot.end).getTime();
    const prefStart = new Date(preference.start).getTime();
    const prefEnd = new Date(preference.end).getTime();

    const overlapStart = Math.max(slotStart, prefStart);
    const overlapEnd = Math.min(slotEnd, prefEnd);

    if (overlapStart >= overlapEnd) return 0;
    return (overlapEnd - overlapStart) / (1000 * 60 * 60);
}

function scoreAndSelectBest(slots, preferences) {
    if (!slots || slots.length === 0) return null;

    const scoredSlots = slots.map(slot => {
        let score = 0;
        let prefCount = 0;

        preferences.forEach(pref => {
            const overlap = calculateOverlap(slot, pref);
            if (overlap > 0) {
                const prefWeight = pref.time || 1;
                score += overlap * prefWeight;
                prefCount++;
            }
        });

        return {
            ...slot,
            score,
            prefCount,
            timePenalty: slot.hour < 12
                ? Math.abs(slot.hour + slot.minute / 60 - 10)
                : Math.abs(slot.hour + slot.minute / 60 - 15)
        };
    });

    scoredSlots.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.prefCount !== a.prefCount) return b.prefCount - a.prefCount;
        return a.timePenalty - b.timePenalty;
    });

    return scoredSlots[0];
}

function selectedMatchingHoraire(daysSelected, timeRdv, hoursStart, hoursEnd) {
    return daysSelected.map(day => {
        const availableSlots = findAvailableSlots(
            day.data.events,
            timeRdv,
            hoursStart,
            hoursEnd,
            day.date
        );

        const morningSlots = availableSlots.filter(slot => slot.hour < 12);
        const afternoonSlots = availableSlots.filter(slot => slot.hour >= 12);

        const bestMorning = scoreAndSelectBest(morningSlots, day.data.preference);
        const bestAfternoon = scoreAndSelectBest(afternoonSlots, day.data.preference);

        const slots = [];
        if (bestMorning) slots.push({ ...bestMorning, period: "matin" });
        if (bestAfternoon) slots.push({ ...bestAfternoon, period: "après-midi" });

        return {
            date: day.date,
            dayScore: day.data.score,
            slots
        };
    });
}





//Main function
/**
 * 
 * @param {string[]} contacts 
 * @param {JSON} data 
 * @param {Date} rangeStart 
 * @param {Date} rangeEnd 
 * @param {Number} timeRdv 
 * @param {Number} hoursStart 
 * @param {Number} hoursEnd 
 * @param {Number} numberDayReturn
 * @returns {Object[]} {
 * date , dayScore, 
 * slots[{end : "date",start:"date",hour:Integer,minute:Integer,period: "matin/après-midi",prefCount: Integer,score:Integer,timePenalty:Integer}]}
*/
export function resolveMatchingEvent(
    contacts,
    data,
    rangeStart,
    rangeEnd,
    timeRdv,
    hoursStart = parseInt(8),
    hoursEnd = parseInt(19),
    numberDayReturn = parseInt(3)
) {


    // 1. Récupérer tous les jours de l'intervalle
    const dayInInterval = searchAllDaysInterval(rangeStart.toISOString(), rangeEnd.toISOString());

    // 2. Ajouter "origin" aux contacts
    const allContacts = [...contacts, "origin"];

    // 3. Retirer les jours indisponibles (allDay)
    const arrayDaysValide = dropIndispoDays(allContacts, dayInInterval, data);
    // 4. Créer la structure pour chaque jour valide
    let structureDays = {};
    arrayDaysValide.forEach((day) => {
        structureDays[day] = {
            events: [],
            preference: [],
            score: 0,
        };
    });

    //5. Hydrater la structure des jours dispos
    const plageHoraire = hoursEnd - hoursStart
    structureDays = hydraterStructureDays(structureDays, allContacts, data, plageHoraire)

    //6. Faire le scoring des jours et conserver les x meilleurs jours
    structureDays = calculeScoring(structureDays, arrayDaysValide, plageHoraire)

    //7. Sélectionner les dates avec le plus gros score
    const daysSelected = selectBestDayScoring(structureDays, numberDayReturn, arrayDaysValide);
    //8. Trouver les meilleurs créneaux horaires pour chaque jour
    const finalResult = selectedMatchingHoraire(daysSelected, timeRdv, hoursStart, hoursEnd);
    return finalResult;

}