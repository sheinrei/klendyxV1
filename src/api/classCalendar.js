import { eventKlendyxTable } from "../models/eventKlendyxTable";





class CalendarService {

    constructor(calendar) {
        this.calendar = calendar
    }

}



class CalendarFactory {
    constructor({ db, googleApiClient, outlookApiClient, appleApiClient }) {
        this.db = db; //pour klendyx
        this.googleApiClient = googleApiClient; 
        this.outlookApiClient = outlookApiClient;
        this.appleApiClient = appleApiClient;
    }

    create(providerName) {
        switch (providerName.toLowerCase()) {
            case "klendyx":
                return new KlendyxAdapter(this.db);

            case "google":
                return new GoogleAdapter(this.googleApiClient);

            case "outlook":
                return new OutlookAdapter(this.outlookApiClient);

            case "apple":
                return new AppleAdapter(this.appleApiClient);

            default:
                throw new Error(`Unknown provider: ${providerName}`);
        }
    }
}


class GoogleAdapter {

    createEvent() {

    }
}

class AppleAdapter {

    createEvent() {

    }
}

class OutlookAdapter {

    createEvent() {

    }
}

class KlendyxAdapter {


    createEvent() {

    }

    getAllEvent(db, idUser) {
        const Table = eventKlendyxTable(db);
        const Event = Table.findByPk({
            where: { idUser }
        })
    }
}