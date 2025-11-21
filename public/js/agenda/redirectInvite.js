$(function(){
    const redirect = window.localStorage.getItem("redirect")
    if(redirect){
        window.location.href = redirect
    }
})