//Funtion tools pour le front
//2025-10-07T11:12:17.000Z

const parsingDate =(date)=>{
    const arrayDate = date.split("T")
    const dating = arrayDate[0].split("-")
    const result =  dating[2] + "-" + dating[1] + "-" + dating[0] + " à " + arrayDate[1].split(":")[0] + "h" + arrayDate[1].split(":")[1];

    return result
}