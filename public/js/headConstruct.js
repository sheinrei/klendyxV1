
const headAdd = [
    `<link rel="stylesheet" href="./css/generic.css"></link>`,
    `<link rel="stylesheet" href="./css/navbar.css"></link>`,
    `<link rel="stylesheet" href="./css/footer.css"></link>`,
    `<meta charset="UTF-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

]


headAdd.map((e) => {
    $('head').append(e)
})


