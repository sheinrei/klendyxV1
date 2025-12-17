const parsingDate = (date) => {
    const arrayDate = date.split("T")
    const dating = arrayDate[0].split("-")
    const result = dating[2] + "-" + dating[1] + "-" + dating[0] + " à " + arrayDate[1].split(":")[0] + "h" + arrayDate[1].split(":")[1];

    return result
}


function formatDateRfc3339(dateStr) {
    const d = new Date(dateStr);
    const pad = n => String(n).padStart(2, '0');

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    const offsetMin = -d.getTimezoneOffset();
    const sign = offsetMin >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(offsetMin) / 60));
    const offsetMinutes = pad(Math.abs(offsetMin) % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
}

const parsingHours = (time) => {
    const totalHours = parseFloat(String(time).replace(',', '.'));

    const hours = Math.floor(totalHours);
    let minutes = Math.round((totalHours - hours) * 60);

    if (minutes < 10) minutes = "0" + minutes
    // Formater le résultat
    if (hours === 0) {
        return `${minutes}m`;
    } else if (minutes === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h ${minutes}m`;
    }
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function validateEmail(email) {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const scrollTo = () => window.scrollTo({
    top: 0,
    behavior: "smooth"
});

const firstToUpper = (string) => string[0].toUpperCase() + string.toLowerCase().slice(1)

const dateToFr = (date) => {
    const ObjectDate = new Date(date);
    const dateFr = ObjectDate.toLocaleDateString("FR-fr", { day: "numeric", month: "long", year: "numeric" });
    return dateFr
}







async function checkCalendarSync(host) {
    
    const synchro = await fetch(`${host}/api/calendar/all-sync`, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    })
    const data = await synchro.json()
    return data
}