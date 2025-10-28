const removeM = () => $("#fc-day-modale").remove()

function createFcDayModale(infos) {

    const draggables = infos.draggedEl

    //si c'est un elem drag
    let value;
    if (draggables) {
        value = infos.draggedEl.attributes.value.value
    }

    //console.log(infos)
    const html = `
        <div id="fc-day-modale">
        
        <div>
        <label>Ajouter un evenement le :</label><br>
        <label>${infos.dateStr}</label>
        



                <form>
                    <label for="summary">Titre :</label>
                    ${value ? `<label>${value}</label>` : `<input type="texte" name="summary" id="summary">`}

                    <label for="time-star">Heure de début :</label>
                    <input id="time-start" name="time-start" type="time" value="12:00">

                    <label for="time-end">Heure de fin :</label>
                    <input type="time" id="time-end" name="time-end" value="12:00">

                    <label for="description">Description :</label>
                    <input type="texte" name="description" id="description">



                    <span>Enregister sur :</span>

                    <div class="frame-form">
                        <input type="checkbox" value="calendyx" id="origin-calendix">
                        <label>Calendyx</label>
                    </div>

                    <div class="frame-form">
                        <input type="checkbox" value="google" id="origin-google">
                        <label>Google</label>
                    </div>

                    <div class="frame-form">
                        <input type="checkbox" value="apple" id="origin-apple">
                        <label>Apple</label>
                    </div>
                    
                    <div class="frame-form">
                        <label>Repetition tout les :</label>
                        <select id="repeat-every">
                            <option value="day">Jours</option>
                            <option value="WEEKLY">Semaines</option>
                            <option value="month">Mois</option>
                            <option value="year">Années</option>
                            <option value="troll">1.000 ans</option>
                        </select>
                    </div>


                </form>
            </div>

            <div class="frame-btn">
                <button id="btn-close-modale-day">Fermer</button>
                <button id="btn-submit-event">Valier</button>
            </div>
        </div>
    `

    $("#calendar").append(html)
}



$(document).on("click", "#btn-close-modale-day", (e) => {
    e.preventDefault()
    removeM()
})

$(document).on("click", "#btn-submit-event", async (e) => {
    e.preventDefault()

    const timeStart = $("#time-start").val()
    const timeEnd = $("#time-end").val()

    const originCalendyx = $("#origin-calendyx").is(":checked")
    const originGoogle = $("#origin-google").is(":checked")
    const originApple = $("#origin-apple").is(":checked")

    const repeatEvery = $("#repeat-every").val()
    console.log({
        originCalendyx,
        originGoogle,
        originApple,
        timeStart,
        timeEnd,
        repeatEvery,
    })


    if(originGoogle){
        const res = await fetch(`${host}/api/calendar/google/create`, {
            method: "POST",
    
            headers: {
                "Authorization": "Bearer " + token,
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                summary,
                description,
                dateStart,
                dateEnd
            })
        })
        console.log(res);
    }
    if (originCalendyx){
        
    }



})


