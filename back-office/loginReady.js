$(document).ready(() => {
    if(localStorage.token !== undefined) {
      if(parseJWT(localStorage.token).auth >= 3){
        redirect("home.html");
      }
    }
})
