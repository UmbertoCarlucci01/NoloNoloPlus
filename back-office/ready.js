$(window).on("pageshow", (event) => {
  if(localStorage.token === undefined) {
      redirect("index.html");
  }
  else if(parseJWT(localStorage.token).auth < 3){
      redirect("index.html");
  }
})
