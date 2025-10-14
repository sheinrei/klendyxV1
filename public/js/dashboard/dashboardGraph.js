const widthRow = $(".graph-row").width();
const count = Math.floor(widthRow / 150);
const today = new Date();

const setGraph = async () => {
  const res = await fetch("http://localhost:3000/api/event/get", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": "bearer " + token,
    },
  });
  const data = await res.json();

  let smsCount = {};
  let emailCount = {};
  const events = data.event.data;

  //compter les event et trier par date
  events.forEach((e) => {
    const dateKey = new Date(e.createdAt).toISOString().split("T")[0];

    if (e.plateformSender.includes("sms")) {
      smsCount[dateKey] = (smsCount[dateKey] || 0) + 1;
    }
    if (e.plateformSender.includes("email")) {
      emailCount[dateKey] = (emailCount[dateKey] || 0) + 1;
    }
  });



  // envoyer les data dans le dom
  for (let i = count; i >= 0; i--) {
    const retroDate = new Date(today);
    retroDate.setDate(today.getDate() - i);

    const dateKey = retroDate.toISOString().split("T")[0];

    const currentDate = retroDate.getUTCDate() + "/" + (retroDate.getMonth() + 1) + "/" + retroDate.getFullYear();


    // remplacer la date de today par "aujourd'hui"
    const isToday = retroDate.toDateString() === today.toDateString();
    const label = isToday ? "Aujourd'hui" : currentDate;



    // chercher le nombre 
    const nbMail = emailCount[dateKey] || 0;
    const nbSms = smsCount[dateKey] || 0;

    // row = 50px (border 1 px à concidérer?)
    const heightMail = nbMail * 10;
    const heightSms = nbSms * 10;

    const html = `<p class="graph-date" id="graph-date-${i}">${label}</p>`;
    
    const styleMail = document.createElement("style");
    const styleSms = document.createElement("style");

    styleMail.innerHTML = `
      #graph-date-${i}::before {
        content: "";
        position: absolute;
        top: -${heightMail}px;
        left: 2px;
        background-color: black;
        height: ${heightMail}px;
        width: 20px;
        border-radius: 4px;
        transition: height 0.3s ease;
      }
    `;

    styleSms.innerHTML = `
      #graph-date-${i}::after {
        content: "";
        position: absolute;
        top: -${heightSms}px;
        left: 25px;
        background-color: blue;
        height: ${heightSms}px;
        width: 20px;
        border-radius: 4px;
        transition: height 0.3s ease;
      }
    `;

    document.head.appendChild(styleMail);
    document.head.appendChild(styleSms);
    $(".graph-footer").append(html);
  }
};

setGraph();