// CalendarGraph.js
import GraphController from "./GraphController.js";
import { getDataCalendar } from "./fetchData.js";

export default class GraphChargeWeek {

    constructor(calendarSync) {
        this.calendarSync = calendarSync;
        this.graphController = new GraphController();
        this.weekNumber = 0;
        this.dataCalendar = {};
        this.dataLabel = []
    }

    // ==== Utilitaires ====
    static getHoursEvent(event) {
        const start = new Date(event.dateStart);
        const end = new Date(event.dateEnd);
        const diff = end.getTime() - start.getTime();
        return diff / 1000 / 60 / 60; // heures
    }

    static formatDate(date) {
        // format YYYY-MM-DD pour comparaison fiable
        //return new Date(date).toISOString().split("T")[0];
        return new Date(date).toLocaleDateString("FR-fr", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });
    }

    static getWeekDates(switchWeek = 0) {
        const today = new Date();
        const currentDay = today.getDay();
        const currentDate = today.getDate();
        const mondayDate = currentDay === 0 ? currentDate - 6 : currentDate - (currentDay - 1);

        const week = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(mondayDate + i + switchWeek * 7);
            week.push(GraphChargeWeek.formatDate(date));
        }
        return week;
    }




    // ==== Récupération des données ====
    async fetchAllData() {
        try {
            const allData = {};
            const providers = ["google", "outlook", "apple"];

            for (const provider of providers) {

                if (this.calendarSync[provider]?.sync) {
                    const data = await getDataCalendar(provider);
                    allData[provider] = data?.data?.data?.events ?? [];
                }

            }

            // toujours récupérer Klendyx
            const klendyxData = await getDataCalendar("klendyx");
            allData["klendyx"] = klendyxData?.data?.data?.events ?? [];
            this.dataCalendar = allData;

            return allData;

        } catch (err) {

            throw new Error(
                `Échec récupération events. Calendars: ${JSON.stringify(this.calendarSync)}. Erreur: ${err.message}`
            );

        }
    }




    // ==== Préparation des labels / données par semaine ====
    hydrateDataWeek(weekNumber = 0) {
        const labels = GraphChargeWeek.getWeekDates(weekNumber);
        const data = Array(7).fill(0);

        Object.values(this.dataCalendar).forEach((events) => {
            events.forEach((event) => {
                const eventDate = GraphChargeWeek.formatDate(event.dateStart);
                const index = labels.indexOf(eventDate);
                if (index !== -1) {
                    const hours = GraphChargeWeek.getHoursEvent(event);
                    data[index] += hours;
                }
            });
        });

        this.dataLabel = [...labels]
        return { labels, data };
    }

    // ==== Création / mise à jour du graphe ====
    async renderGraph() {
        const ctx = document.getElementById("graph-charge-event");
        const prepareGraph = this.hydrateDataWeek(this.weekNumber);
        this.graphController.createGraph(
            "line",
            ctx,
            prepareGraph.labels,
            prepareGraph.data,
            "Heures",
            "chargeEventGraph"
        );
    }

    async updateGraphForWeek() {
        const prepareGraph = this.hydrateDataWeek(this.weekNumber);
        this.graphController.updateGraph(
            "chargeEventGraph",
            prepareGraph.labels,
            prepareGraph.data
        );
    }


    // ==== Navigation semaines ====
    attachWeekNavigation() {
        $("#charge-event-previous-week").on("click", async (e) => {
            e.preventDefault();
            $(e.currentTarget).prop("disabled", true);
            this.weekNumber--;
            await this.updateGraphForWeek();
            $(e.currentTarget).prop("disabled", false);
            this.setWeekTitle()
        });

        $("#charge-event-next-week").on("click", async (e) => {
            e.preventDefault();
            $(e.currentTarget).prop("disabled", true);
            this.weekNumber++;
            await this.updateGraphForWeek();
            $(e.currentTarget).prop("disabled", false);

            this.setWeekTitle()
        });
    }

    setWeekTitle() {
        const data = this.dataLabel
        const dayStart = data[0].split(" ")[1]
        const dayEnd = data[6].split(" ")[1]
        const month = data[6].split(" ")[2]
        const str = `${dayStart} - ${dayEnd} ${month} `
        $("#week-title").text(str)
    }


    // ==== Initialisation complète ====
    async init() {
        await this.fetchAllData();
        await this.renderGraph();
        this.setWeekTitle()
        this.attachWeekNavigation();
    }
}