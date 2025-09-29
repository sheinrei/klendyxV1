

const btn = document.getElementById("btnDeconnection")

btn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/connection";
})