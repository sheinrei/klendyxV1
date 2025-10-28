

const btn = document.getElementById("btnDeconnection")

btn.addEventListener("click", function (e) {
    localStorage.removeItem("token");
    window.location.href = "/connection";
})