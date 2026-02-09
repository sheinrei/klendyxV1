import AppleAdapter from "./adapter/AppleAdapter.js";
import GoogleAdapter from "./adapter/GoogleAdapter.js";
import KlendyxAdapter from "./adapter/KlendyxAdapter.js";
import OutlookAdapter from "./adapter/OutlookAdapter.js";


/**
 * Définis et init le bon adapter selon le provider
 * @param {*} provider -string- "klendyx"/"google"/"outlook"/"apple"
 * @param {*} db 
 * @param {*} userId 
 * @returns 
 */

export function getCalendarAdapter (provider, db, userId) {
    
    switch (provider) {
        case "klendyx":
            return new KlendyxAdapter(db, userId);
        case "google":
            return new GoogleAdapter(db, userId);
        case "outlook":
            return new OutlookAdapter(db, userId);
        case "apple":
            return new AppleAdapter(db, userId)
        default:
            throw new Error(`Provider Calendar non supporté : ${provider}`)
    }
}