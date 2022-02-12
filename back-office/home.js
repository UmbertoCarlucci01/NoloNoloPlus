$(window).on("pageshow", (event) => {
  getPendingRentals();
})

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};


function getUsers(){
  $('#username').html("")
  $('#List').html("Caricamento in corso")
  $.ajax({
         url: "https://site202129.tw.cs.unibo.it/api/users/",
         type: "GET",
         beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
         success: function(res) {
          var imgUrl = "https://site202129.tw.cs.unibo.it/img/customersAvatar/"
          var defaultAvatar = "https://site202129.tw.cs.unibo.it/img/customersAvatar/defaultCustomer.jpg"
          var globalDiv = `<div class="row" >`
          for(let i = 0; i < res.length; i++){
            let userDiv=`<div class="col-6 col-sm-4 col-md-3 mb-3"><div class="card">`
            if(res[i].avatar) userDiv+=`<img src="${imgUrl}${res[i].avatar}" alt="Immagine profilo di ${res[i].username}" style="width: 325px; heigth: 330px">`
            else userDiv+=`<img src="${defaultAvatar}" alt="Immagine profilo di ${res[i].username}" style="width: 325px; heigth: 330px">`
            userDiv+=`<div class="card-body"><h5 class="card-title fw-bold">${res[i].username}</h5>`
            userDiv+=`<p class="card-text">`
            userDiv+=`<p class="fw-bold">Nome: <span class="fw-light">${res[i].name}</span></p>`
            userDiv+=`<p class="fw-bold">Cognome: <span class="fw-light">${res[i].surname}</span></p>`
            if(res[i].residence != undefined)
              userDiv+=`<p class="fw-bold">Indirizzo: <span class="fw-light">${res[i].residence}</span></p>`
            userDiv+=`<p class="fw-bold">Identificatore: <break> <span class="fw-light">${res[i]._id}</span></p>`
            userDiv+=`<p class="fw-bold">Metodo di pagamento: <span class="fw-light">${res[i].paymentmethod}</span></p>`
            userDiv+=`<p><div class="row"><div class="col-1"></div><input type="button" class="btn btn-primary col-5" value="Storico Noleggi" onclick="storicoNoleggi('${res[i]._id}', '${res[i].username}')">`
            userDiv+=`<div class="col-1"></div><input type="button" class="btn btn-primary col-4" value="Modifica" onclick="modificaDati('${res[i]._id}')"><div class="col-1"></div></div></p>`
            userDiv+=`<div class="row"><div class="col-3"></div><input type="button" class="btn btn-danger col-6" value="Elimina utente" onclick="eliminaUtente('${res[i]._id}')"><div class="col-3"></div></div>`
            userDiv+=`</p></div></div></div>`
            globalDiv += userDiv
          } 
          globalDiv +="</div>"
          $('#List').html(globalDiv)
         }
      });
}

function logout(){
  localStorage.removeItem('token');
  $(location).attr("href", "index.html");
}


function eliminaUtente(id){
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/users/${id}/rentals`, 
    type: "GET",
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: async function(res_rentals){
      var toDelete = true;
      let i = 0;
      while(i < res_rentals.length && toDelete){
        if(res_rentals[i].state != 'ended' ){
          toDelete = false;
        }
        i++
      }
      if(toDelete) {
        await $.ajax({
          url: `https://site202129.tw.cs.unibo.it/api/users/${id}`,
          type: "DELETE",
          beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
          success: function(res){
            $('#List').html("");
            $('#List').html("Utente eliminato, verrai reindirizzato alla home.");
            $('#List').focus();
            setTimeout(() => {redirect("home.html")}, 3500);
          }
        });
      }
      else {
        $('#List').html("");
        $('#List').html("Impossibile eliminare un utente con noleggi in attesa, accettati o in atto. Verrai reindirizzato alla home.");
        $('#List').focus();
        setTimeout(() => {redirect("home.html")}, 5000);
      }
    }
  })
}


function storicoNoleggi(id, username){
  $('#List').html("Caricamento in corso");
  $('#username').html("Lista noleggi di "+username);
  var globalDiv = `<div class="row">`
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/users/${id}/rentals`, 
    type: "GET",
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: async function(res_rental){
      imgUrl = "https://site202129.tw.cs.unibo.it/img/articlesImages/"
       for(let i = 0; i<res_rental.length; i++){
        await $.ajax({
          url: `https://site202129.tw.cs.unibo.it/api/articles/${res_rental[i].object_id}`,
          type: "GET",
          beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
          success: function(res_object){
            let objectDiv=`<div class="col-6 col-sm-4 col-md-3 mb-3"><div class="card">`
            objectDiv+=`<img src="${imgUrl}${res_object.img}" class="card-img-top" alt="Immagine dell'oggetto" class="card-img-top" width="1000" style="width: 100%; height:20vw; object-fit: cover;">`
            objectDiv+=`<div class="card-body"><h5 class="card-title fw-bold">${res_object.name}</h5><h6 class="card-subtitle mb-2 text-muted">${res_object.superCategory}</h6>`
            objectDiv+=`<p class="card-text">`
            objectDiv+=`<p class="fw-bold">Data di inizio: <span class="fw-light">${res_rental[i].date_start.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Data di fine: <span class="fw-light">${res_rental[i].date_end.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Prezzo: <span class="fw-light">${res_rental[i].estimated.price}</span></p>`
            for(let j=0; j<res_rental[i].estimated.summary.length; j++)
              objectDiv+=`<p class="fw-bold">Modifica: <span class="fw-light">${res_rental[i].estimated.summary[j]}</span></p>`
            objectDiv+=`</p></div></div></div>`
            globalDiv += objectDiv 
          }
        })    
      }
      globalDiv +="</div>"
      if(globalDiv == '<div class="row"></div>')
        $('#List').html("Nessun noleggio trovato");
      else
        $('#List').html(globalDiv)
    }
  })
}

function modificaDati(id){
  redirect(`modificaDati.html?id=${id}`);
}


function getArticles(){
  $('#username').html("")
  $('#List').html("Caricamento in corso")
  $.ajax({
    url: "https://site202129.tw.cs.unibo.it/api/articles/",
    type: "GET",
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: async function(res) {
      console.log(res)
      var imgUrl = "https://site202129.tw.cs.unibo.it/img/articlesImages/"
      var globalDiv = `<div class="row">`
      var available;
      var canBeDeleted = false;
      for(let i = 0; i < res.length; i++){
        available = true;
        await $.ajax({
          // url: `https://site202129.tw.cs.unibo.it/api/articles/${res[i]._id}/available?start=${yesterday}&end=${today}`,
          url: `https://site202129.tw.cs.unibo.it/api/articles/${res[i]._id}/rentals?state=progress`,
          type: "GET",
          beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
          success: function(res2){
            available = true;
            if(res2.length > 0)
              available = false;
          }
        }) 
        canBeDeleted = false;
        let articleDiv=`<div class="col-6 col-sm-4 col-md-3 mb-3"><div class="card">`
        articleDiv+=`<img src="${imgUrl}${res[i].img}" alt="Immagine dell'articolo: ${res[i].name}" width="1000" class="card-img-top" style="width: 100%; height:20vw; object-fit: cover;">`
        articleDiv+=`<div class="card-body"><h5 class="card-title fw-bold">${res[i].name}</h5>`
        articleDiv+=`<p class="card-text">`
        articleDiv+=`<p class="fw-bold">Categoria: <span class="fw-light">${res[i].category}</span></p>`
        articleDiv+=`<p class="fw-bold">Identificatore: <break> <span class="fw-light">${res[i]._id}</span></p>`
        if(res[i].state == 'perfect'){
          articleDiv+=`<p class="fw-bold">Stato: <span class="fw-light">Perfetto</span></p>`
        }
        else if(res[i].state == 'good'){
          articleDiv+=`<p class="fw-bold">Stato: <span class="fw-light">Ottimo</span></p>`
        }
        else if(res[i].state == 'suitable'){
          articleDiv+=`<p class="fw-bold">Stato: <span class="fw-light">Buono</span></p>`
        }
        else if(res[i].state == 'unavailable') {
          articleDiv+=`<p class="fw-bold">Stato: <span class="fw-light">Non disponibile</span></p>`
        }
        else {
          articleDiv+=`<p class="fw-bold">Stato: <span class="fw-light">Rotto</span></p>`
        }
        await $.ajax({
          url: `https://site202129.tw.cs.unibo.it/api/articles/${res[i]._id}/rentals`,
          type: "GET",
          beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
          success: function(res3){
            if(res3.length == 0) canBeDeleted = true;
          }  
        })
        if(res[i].state == 'broken' || res[i].state == 'unavailable') {
          articleDiv+=`<div class="d-flex justify-content-center"><div class="row"><input type="button" class="btn btn-primary col-12" value="Rendi di nuovo disponibile" onclick="markAsGood('${res[i]._id}')"></div></div>`
        }
         else {
          articleDiv+=`<div class="d-flex justify-content-center"><div class="row"><input type="button" class="btn btn-primary col-12" value="Crea Noleggio" onclick="createRental('${res[i]._id}')"></div></div>`
          if(available){
            articleDiv+=`<div class="d-flex justify-content-center mt-2"><div class="row"><input type="button" class="btn btn-primary col-12 col-sm-5" value="Modifica dati" onclick="modificaArticolo('${res[i]._id}')">`
            articleDiv+=`<div class="col-0 col-sm-1"></div><input type="button" class="btn btn-primary col-12 col-sm-6" value="Segnala come rotto" onclick="markAsBroken('${res[i]._id}')"></div></div>`
          }
        }
        if(canBeDeleted) articleDiv+=`<div class="d-flex justify-content-center mt-3"><input type="button" class="btn btn-danger col-12" value="Elimina questo articolo" onclick="eliminaArticoli('${res[i]._id}')"></div>`  
        articleDiv+=`</p></div></div></div>`
        globalDiv += articleDiv
      } 
      globalDiv +="</div>"
      $('#List').html(globalDiv)
    }
 });
}


function modificaArticolo(id){
  redirect(`modificaArticolo.html?id=${id}`);
}

function addArticle(){
  redirect('aggiungiArticolo.html');
}

function eliminaArticoli(id){
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/articles/${id}`,
    type: 'DELETE',
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: function(data){
      redirect('home.html');
    },
    error: function(err){

    },
  });
}

function markAsBroken(id){
  let toSend = {};
  toSend.state="broken";
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/articles/${id}`,
    type: 'PATCH',
    contentType: 'application/json',
    data: JSON.stringify(toSend),
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: function(data){
      redirect("home.html")
    }
  });  
}


function markAsGood(id){
  let toSend = {};
  toSend.state="good";
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/articles/${id}`,
    type: 'PATCH',
    contentType: 'application/json',
    data: JSON.stringify(toSend),
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: function(data){
      redirect("home.html")
    }
  });  
}


function getPendingRentals(){
  $('#username').html("")
  $('#List').html("Caricamento in corso")
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/rentals?state=pending`,
    type: 'GET',
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: async function(res_rental){
      imgUrl = "https://site202129.tw.cs.unibo.it/img/articlesImages/"
      var globalDiv = `<div class="row">`
       for(let i = 0; i<res_rental.length; i++){
        await $.ajax({
          url: `https://site202129.tw.cs.unibo.it/api/articles/${res_rental[i].object_id}`,
          type: "GET",
          beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
          success: function(res_object){
            let objectDiv=`<div class="col-6 col-sm-4 col-md-3 mb-3"><div class="card" style="height: 770px;">`
            objectDiv+=`<img src="${imgUrl}${res_object.img}" alt="Immagine dell'oggetto" class="card-img-top" width="1000" style="width: 100%; height:20vw; object-fit: cover;">`
            objectDiv+=`<div class="card-body"><h5 class="card-title fw-bold">${res_object.name}</h5><h6 class="card-subtitle mb-2 text-muted">${res_object.superCategory}</h6>`
            objectDiv+=`<p class="card-text">`
            objectDiv+=`<p class="fw-bold">Data di inizio: <span class="fw-light">${res_rental[i].date_start.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Data di fine: <span class="fw-light">${res_rental[i].date_end.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Prezzo: <span class="fw-light">${res_rental[i].estimated.price}</span></p>`
            for(let j=0; j<res_rental[i].estimated.summary.length; j++)
              objectDiv+=`<p class="fw-bold">Modifica: <span class="fw-light">${res_rental[i].estimated.summary[j]}</span></p>`
            objectDiv+=`<div class="d-flex justify-content-center"><div class="row"><input type="button" class="btn btn-primary col-12 col-sm-5" value="Accetta" onclick="acceptRental('${res_rental[i]._id}')">`
            objectDiv+=`<div class="col-0 col-sm-1"></div><input type="button" class="btn btn-primary col-12 col-sm-5" value="Rifiuta" onclick="denyRental('${res_rental[i]._id}')"></div></div>`
            objectDiv+=`<div class="d-flex justify-content-center mt-2"><input type="button" class="btn btn-primary col-12" value="Modifica noleggio" onclick="modifyRental('${res_rental[i]._id}')"></div>`
            objectDiv+=`</p></div></div></div>`
            globalDiv += objectDiv 
          }
        })    
      }
      globalDiv +="</div>"
      if(globalDiv == '<div class="row"></div>')
        $('#List').html("Nessun noleggio trovato");
      else
        $('#List').html(globalDiv)
    }
  }); 
}

function modifyRental(id){
  redirect(`modificaNoleggio.html?id=${id}`);
}


function acceptRental(id){
  let funcId = parseJwt(localStorage['token']).id;
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/rentals/${id}`,
    type: 'PATCH',
    data: JSON.stringify({state: "approved", functionaryId: funcId}),
    contentType: 'application/json',
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: function(data){
      redirect("home.html");
    },
  })
}

function denyRental(id){
  let funcId = parseJwt(localStorage['token']).id;
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/rentals/${id}`,
    type: 'PATCH',
    contentType: 'application/json',
    data: JSON.stringify({state: "deleted", functionaryId: funcId}),
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: function(data){
      redirect("home.html");
    }
  })
}

function getStartingRentals(){
  $('#username').html("")
  $('#List').html("Caricamento in corso")
  var today = new Date().toISOString().split('T')[0]
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/rentals?state=approved&start=${today}`,
    type: 'GET',
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: async function(res_rental){
      imgUrl = "https://site202129.tw.cs.unibo.it/img/articlesImages/"
      var globalDiv = `<div class="row">`
      for(let i = 0; i<res_rental.length; i++){
        if(res_rental[i].date_start.substring(0,10) == today){
          await $.ajax({
            url: `https://site202129.tw.cs.unibo.it/api/articles/${res_rental[i].object_id}`,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
            success: function(res_object){
              let objectDiv=`<div class="col-6 col-sm-4 col-md-3 mb-3"><div class="card">`
              objectDiv+=`<img src="${imgUrl}${res_object.img}" class="card-img-top" alt="Immagine dell'oggetto" class="card-img-top" width="1000" style="width: 100%; height:20vw; object-fit: cover;">`
              objectDiv+=`<div class="card-body"><h5 class="card-title fw-bold">${res_object.name}</h5><h6 class="card-subtitle mb-2 text-muted">${res_object.superCategory}</h6>`
              objectDiv+=`<p class="card-text">`
              objectDiv+=`<p class="fw-bold">Data di inizio: <span class="fw-light">${res_rental[i].date_start.substring(0,10)}</span></p>`
              objectDiv+=`<p class="fw-bold">Data di fine: <span class="fw-light">${res_rental[i].date_end.substring(0,10)}</span></p>`
              objectDiv+=`<p class="fw-bold">Prezzo: <span class="fw-light">${res_rental[i].estimated.price}</span></p>`
              for(let j=0; j<res_rental[i].estimated.summary.length; j++)
                objectDiv+=`<p class="fw-bold">Modifica: <span class="fw-light">${res_rental[i].estimated.summary[j]}</span></p>`
              objectDiv+=`<div class="d-flex justify-content-center"><input type="button" class="btn btn-primary col-12" value="Articolo prelevato" onclick="articleTaken('${res_rental[i]._id}')">`
              objectDiv+=`</div>`
              objectDiv+=`</p></div></div></div>`
              globalDiv += objectDiv 
            }
        })}    
      }
      globalDiv +="</div>"
      if(globalDiv == '<div class="row"></div>')
        $('#List').html("Nessun noleggio trovato");
      else
        $('#List').html(globalDiv)
    }
  });
}

function articleTaken(id){
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/rentals/${id}`,
    type: 'PATCH',
    contentType: 'application/json',
    data: JSON.stringify({state: "progress"}),
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: function(data){
      redirect("home.html");
    },
    error: function(data){
      $('#message').attr('style', "color: red;")
      $('#message').html("Impossibile noleggiare un articolo rotto.")
      $('#message').focus()
      setTimeout(() => {$('#message').html("")}, 3500);
    }
  })
}


function getEndingRentals(){
  $('#username').html("")
  $('#List').html("Caricamento in corso")
  var today = new Date().toISOString().split('T')[0]
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/rentals?state=progress&date_end=${today}`,
    type: 'GET',
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: async function(res_rental){
      imgUrl = "https://site202129.tw.cs.unibo.it/img/articlesImages/"
      var globalDiv = `<div class="row">`
       for(let i = 0; i<res_rental.length; i++){
        await $.ajax({
          url: `https://site202129.tw.cs.unibo.it/api/articles/${res_rental[i].object_id}`,
          type: "GET",
          beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
          success: function(res_object){
            let objectDiv=`<div class="col-12 col-sm-6 col-md-4 col-md-3 mb-3"><div class="card">`
            objectDiv+=`<img src="${imgUrl}${res_object.img}" class="card-img-top" alt="Immagine dell'oggetto" class="card-img-top" width="1000" style="width: 100%; height:20vw; object-fit: cover;">`
            objectDiv+=`<div class="card-body"><h5 class="card-title fw-bold">${res_object.name}</h5><h6 class="card-subtitle mb-2 text-muted">${res_object.superCategory}</h6>`
            objectDiv+=`<p class="card-text">`
            objectDiv+=`<p class="fw-bold">Data di inizio: <span class="fw-light">${res_rental[i].date_start.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Data di fine: <span class="fw-light">${res_rental[i].date_end.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Prezzo: <span class="fw-light">${res_rental[i].estimated.price}</span></p>`
            for(let j=0; j<res_rental[i].estimated.summary.length; j++)
              objectDiv+=`<p class="fw-bold">Modifica: <span class="fw-light">${res_rental[i].estimated.summary[j]}</span></p>`
            objectDiv+=`<div class="d-flex justify-content-center"><input type="button" class="btn btn-primary" value="Articolo rientrato" onclick="articleRetrieved('${res_rental[i]._id}')">`
            objectDiv+=`<div class="col-0 col-sm-1"></div>`
            objectDiv+=`<div class="col-12 col-sm-6">`
            objectDiv+=`<label for="newState${res_rental[i]._id}">Stato di restituzione</label>`
            objectDiv+=`<select id="newState${res_rental[i]._id}" name="newState${res_rental[i]._id}" class="form-select form-select-md">`
            if(res_object.state == "perfect"){
              objectDiv+= `<option selected value="perfect">Perfetto</option>`
              objectDiv+= `<option value="good">Ottimo</option>`
              objectDiv+= `<option value="suitable">Buono</option>`
              objectDiv+= `<option value="broken">Rotto</option>`
            }
            if(res_object.state == "good"){
              objectDiv+= `<option selected value="good">Ottimo</option>`
              objectDiv+= `<option value="suitable">Buono</option>`
              objectDiv+= `<option value="broken">Rotto</option>`
            }
            if(res_object.state == "suitable"){
              objectDiv+= `<option selected value="suitable">Buono</option>`
              objectDiv+= `<option value="broken">Rotto</option>`
            }
            objectDiv+=`</select></div>`
            objectDiv+=`</div>`
            objectDiv+=`</p></div></div></div>`
            globalDiv += objectDiv 
          }
        })    
      }
      globalDiv +="</div>"
      if(globalDiv == '<div class="row"></div>')
        $('#List').html("Nessun noleggio trovato");
      else
        $('#List').html(globalDiv)
    }
  });
}


function getDelayedRentals(){
  $('#username').html("")
  $('#List').html("Caricamento in corso")
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/rentals?state=delayed`,
    type: 'GET',
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: async function(res_rental){
      imgUrl = "https://site202129.tw.cs.unibo.it/img/articlesImages/"
      var globalDiv = `<div class="row">`
       for(let i = 0; i<res_rental.length; i++){
        await $.ajax({
          url: `https://site202129.tw.cs.unibo.it/api/articles/${res_rental[i].object_id}`,
          type: "GET",
          beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
          success: function(res_object){
            console.log(res_object)
            let objectDiv=`<div class="col-12 col-sm-6 col-md-4 mb-3"><div class="card">`
            objectDiv+=`<img src="${imgUrl}${res_object.img}" class="card-img-top" alt="Immagine dell'oggetto" class="card-img-top" width="1000" style="width: 100%; height:20vw; object-fit: cover;">`
            objectDiv+=`<div class="card-body"><h5 class="card-title fw-bold">${res_object.name}</h5><h6 class="card-subtitle mb-2 text-muted">${res_object.superCategory}</h6>`
            objectDiv+=`<p class="card-text">`
            objectDiv+=`<p class="fw-bold">Data di inizio: <span class="fw-light">${res_rental[i].date_start.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Data di fine: <span class="fw-light">${res_rental[i].date_end.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Prezzo: <span class="fw-light">${res_rental[i].estimated.price}</span></p>`
            for(let j=0; j<res_rental[i].estimated.summary.length; j++)
              objectDiv+=`<p class="fw-bold">Modifica: <span class="fw-light">${res_rental[i].estimated.summary[j]}</span></p>`
            objectDiv+=`<div class="d-flex justify-content-center"><input type="button" class="btn btn-primary " value="Articolo rientrato" onclick="articleRetrieved('${res_rental[i]._id}')">`
            objectDiv+=`<div class="col-0 col-sm-1"></div>`
            objectDiv+=`<div class="col-12 col-sm-6">`
            objectDiv+=`<label for="newState${res_rental[i]._id}">Stato di restituzione</label>`
            objectDiv+=`<select id="newState${res_rental[i]._id}" name="newState${res_rental[i]._id}" class="form-select form-select-md">`
            if(res_object.oldState == "perfect"){
              objectDiv+= `<option selected value="perfect">Perfetto</option>`
              objectDiv+= `<option value="good">Ottimo</option>`
              objectDiv+= `<option value="suitable">Buono</option>`
              objectDiv+= `<option value="broken">Rotto</option>`
            }
            if(res_object.oldState == "good"){
              objectDiv+= `<option selected value="good">Ottimo</option>`
              objectDiv+= `<option value="suitable">Buono</option>`
              objectDiv+= `<option value="broken">Rotto</option>`
            }
            if(res_object.oldState == "suitable"){
              objectDiv+= `<option selected value="suitable">Buono</option>`
              objectDiv+= `<option value="broken">Rotto</option>`
            }
            objectDiv+=`</select></div>`
            objectDiv+=`</div>`
            objectDiv+=`</p></div></div></div>`
            globalDiv += objectDiv 
          }
        })    
      }
      globalDiv +="</div>"
      if(globalDiv == '<div class="row"></div>')
        $('#List').html("Nessun noleggio trovato");
      else
        $('#List').html(globalDiv)
    }
  });
}

function articleRetrieved(id){
  let newState = $(`#newState${id}`).val()
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/rentals/${id}/close?state=${newState}`,
    type: 'PATCH',
    contentType: 'application/json',
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: function(data){
      redirect("home.html");
    }
  })
}

function getActiveRentals(){
  $('#username').html("")
  $('#List').html("Caricamento in corso")
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/rentals?state=progress`,
    type: 'GET',
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: async function(res_rental){
      imgUrl = "https://site202129.tw.cs.unibo.it/img/articlesImages/"
      var globalDiv = `<div class="row">`
       for(let i = 0; i<res_rental.length; i++){
        await $.ajax({
          url: `https://site202129.tw.cs.unibo.it/api/articles/${res_rental[i].object_id}`,
          type: "GET",
          beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
          success: function(res_object){
            let objectDiv=`<div class="col-6 col-sm-4 col-md-3 mb-3"><div class="card">`
            objectDiv+=`<img src="${imgUrl}${res_object.img}" class="card-img-top" alt="Immagine dell'oggetto" class="card-img-top" width="1000" style="width: 100%; height:20vw; object-fit: cover;">`
            objectDiv+=`<div class="card-body"><h5 class="card-title fw-bold">${res_object.name}</h5><h6 class="card-subtitle mb-2 text-muted">${res_object.superCategory}</h6>`
            objectDiv+=`<p class="card-text">`
            objectDiv+=`<p class="fw-bold">Data di inizio: <span class="fw-light">${res_rental[i].date_start.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Data di fine: <span class="fw-light">${res_rental[i].date_end.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Prezzo: <span class="fw-light">${res_rental[i].estimated.price}</span></p>`
            for(let j=0; j<res_rental[i].estimated.summary.length; j++)
              objectDiv+=`<p class="fw-bold">Modifica: <span class="fw-light">${res_rental[i].estimated.summary[j]}</span></p>`
            objectDiv+=`</div>`
            objectDiv+=`</p></div></div>`
            globalDiv += objectDiv 
          }
        })    
      }
      globalDiv +="</div>"
      if(globalDiv == '<div class="row"></div>')
        $('#List').html("Nessun noleggio trovato");
      else
        $('#List').html(globalDiv)
    }
  });
}


function getEndedRentals(){
  $('#username').html("")
  $('#List').html("Caricamento in corso")
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/rentals?state=ended`,
    type: 'GET',
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: async function(res_rental){
      imgUrl = "https://site202129.tw.cs.unibo.it/img/articlesImages/"
      var globalDiv = `<div class="row">`
       for(let i = 0; i<res_rental.length; i++){
        await $.ajax({
          url: `https://site202129.tw.cs.unibo.it/api/articles/${res_rental[i].object_id}`,
          type: "GET",
          beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
          success: function(res_object){
            let objectDiv=`<div class="col-6 col-sm-4 col-md-3 mb-3"><div class="card">`
            objectDiv+=`<img src="${imgUrl}${res_object.img}" class="card-img-top" alt="Immagine dell'oggetto" width="1000" style="width: 100%; object-fit: cover;">`
            objectDiv+=`<div class="card-body"><h5 class="card-title fw-bold">${res_object.name}</h5><h6 class="card-subtitle mb-2 text-muted">${res_object.superCategory}</h6>`
            objectDiv+=`<p class="card-text">`
            objectDiv+=`<p class="fw-bold">Data di inizio: <span class="fw-light">${res_rental[i].date_start.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Data di fine: <span class="fw-light">${res_rental[i].date_end.substring(0,10)}</span></p>`
            objectDiv+=`<p class="fw-bold">Prezzo: <span class="fw-light">${res_rental[i].estimated.price}</span></p>`
            for(let j=0; j<res_rental[i].estimated.summary.length; j++)
              objectDiv+=`<p class="fw-bold">Modifica: <span class="fw-light">${res_rental[i].estimated.summary[j]}</span></p>`
            objectDiv+=`</div>`
            objectDiv+=`</p></div></div>`
            globalDiv += objectDiv 
          }
        })    
      }
      globalDiv +="</div>"
      if(globalDiv == '<div class="row"></div>')
        $('#List').html("Nessun noleggio trovato");
      else
        $('#List').html(globalDiv)
    }
  });
}

function createRental(id){
  redirect(`creaNoleggio.html?id=${id}`);
}


function createCrusade(){
  let datestart = $('#date_start').val()
  let dateend = $('#date_end').val()
  $.ajax({
    url: `https://site202129.tw.cs.unibo.it/api/crusades`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({date_start: datestart, date_end: dateend}),
    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
    success: function(data){
      $('#message').attr('style', "color: white;")
      $('#message').html("Crociata creata correttamente");
      $('#message').focus()
    },
    error: function(data){
      $('#message').attr('style', "color: red;")
      $('#message').html(data.responseJSON.message)
      $('#message').focus()
    }
  })
}