
const labelStyle = `style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;`
const inputStyle = `style="width: 100%; box-sizing: border-box; padding: 9px 12px; font-size: 14px; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; background: #fff; color: #111;"`
export const rappelFormHTML = `
  <div style="display: flex; flex-direction: column; gap: 10px;">
     
    <p style="margin:auto; font-weight:500; font-size:20px; margin-bottom:10px">Information du destinataire</p>
    <div id="modale-input-message-alert"></div>
    <!-- NOM -->
    <div class="form-group">
      <label class="modale-label">Nom</label>
      <input
        type="text"
        id="rappel-nom"
        class="modale-input"
      >
    </div>

    <!-- PRENOM -->
    <div class="form-group">
      <label  class="modale-label">Prénom</label>
      <input
        type="text"
        id="rappel-prenom"
        class="modale-input"      >
    </div>

    <!-- PHONE -->
    <div>
      <label  class="modale-label">Téléphone</label>
      <input
        id="rappel-phone"
        type="tel"
        name="phone"
        placeholder="+33 6 00 00 00 00"
        class="modale-input" >
    </div>

    <!-- EMAIL -->
    <div>
      <label class="modale-label">Email</label>
      <input
        id="rappel-email"
        type="email"
        name="email"
        placeholder="exemple@email.com"
        class="modale-input"   >
    </div>

    <div>
      <label class="modale-label">Méthode d'envoi</label>
      <select
        id="rappel-method"
        name="method"
        class="modale-input"      >
        <option value="">Choisir une méthode</option>
        <option value="sms">SMS</option>
        <option value="email">Email</option>
        <option value="sms-email">SMS + Email</option>
      </select>
    </div>

    <!-- DATE EVENT -->
    <div>
      <label class="modale-label" for="rappel-date">Date du rendez-vous</label>
      <input
      id="rappel-date"
      type="date"
      name="rappel-date"
      class="modale-input">
    </div>
    
    <div class="flex-row">
      <!--HOUR START RDV-->
      <div style="width:100%">
        <label
            for="rappel-hour-start"
            class="modale-label">
            Heure de début
        </label>
        <input
            type="time"
            id="rappel-hour-start"
            class="modale-input">
      </div>


      <!-- HOUR END RDV -->
      <div style="width:100%">
        <label for="rappel-hour-end" class="modale-label">Heure de fin</label>
        <input
            type="time"
            id="rappel-hour-end"
            name="rappel-hour-end"
            class="modale-input">
      </div>
  </div>

    <div>
        <label 
        class="modale-label"
        for="rappel-hour-before">
        Rappel avant (h)
        </label>
        <input
          id="rappel-hour-before"
          type="number"
          name="rappel-hour-before"
          min="1"
          max="48"
          value="1"
          class="modale-input">
    </div>
</div>`

export const btnSubmitNewRappel = `
<button id="btn-submit-new-rappel" class="btn-primary">
    Créer le rappel ↗
</button>`



export const setTemplateFormUpdateProposition = (data) => {

  const { dayStart, hourStart, hourEnd, title, recipientName, recipientPhone, recipientEmail } = data;

  console.log({
    dayStart, hourStart, hourEnd, title, recipientName, recipientPhone, recipientEmail
  })

  console.log(data)
  return `
    <div style="display: flex; flex-direction: column; gap: 10px;">

      <div id="modale-message-alert"></div>

      <div>
        <label class="modale-label">Titre du rendez-vous</label>
        <input class="modale-input" type="text" value="${title}" id="update-proposition-title">
      </div>

      <div>
        <label class="modale-label">Nom du destinataire</label>
        <input class="modale-input" type="text" value="${recipientName}" id="update-proposition-recipient-name">
      </div>

      <div>
        <label class="modale-label">Date du rendez-vous</label>
        <input class="modale-input" type="date" value="${dayStart}" id="update-proposition-day-start">
      </div>

      <div class="flex-row">
        <div style="width:100%">
          <label class="modale-label">Heure de début</label>
          <input class="modale-input" type="time" value="${hourStart}" id="update-proposition-hour-start">
        </div>

        <div style="width:100%">
          <label class="modale-label">Heure de fin</label>
          <input class="modale-input" type="time" value="${hourEnd}" id="update-proposition-hour-end">
        </div>
      </div>

      <div>
        <label class="modale-label">Méthode d'envoi</label>
          <select
            id="update-proposition-method"
            name="method"
            style="width: 100%; box-sizing: border-box; padding: 9px 12px; font-size: 14px; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; background: #fff; color: #111; appearance: none; cursor: pointer;"
          >
            <option value="">Choisir une méthode</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="sms-email">SMS + Email</option>
          </select>
      </div>

      <label class="modale-label" for="update-proposition-email">Email</label>
      <input class="modale-input" type="email" value="${recipientEmail}" 
      id="update-proposition-email" name="update-proposition-email">

      <label class="modale-label" for="update-proposition-phone">Phone</label>
      <input class="modale-input" type="text" value="${recipientPhone}"
       id="update-proposition-phone" name="update-proposition-phone">

    </div>
  `
}