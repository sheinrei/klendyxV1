const quine = "const quine = START ;console.log('Quine !')"

console.log(quine.replace("START", JSON.stringify(quine)))

