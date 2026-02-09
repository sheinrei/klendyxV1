


async function createPayment(planName){


    const createPayment = await fetch(`${host}/api/payment/create`,{
        method : "POSt",
        headers : {
            "Content-Type":"application/json"
        },
        body : JSON.stringify({
            planName
        })
    })
}