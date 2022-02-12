$(document).ready(() => {
    $.ajax({
        url: 'https://site202129.tw.cs.unibo.it/api/users/',
        type: 'GET',
        beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
        success: function(res){
            for(let i = 0; i<res.length; i++){
                $('#user').append(`<option value="${res[i]._id}">${res[i].username}</option>`);
            }
        }
    })  
})

function creaNoleggio(){
    let objectId = $.urlParameters("id");
    let start_date = $('#startdate').val();
    let end_date = $('#enddate').val();
    if($('#user').val() == 'default' || start_date == "" || end_date == ""){
        $('#messaggio').attr('style', "color: red;")
        $('#messaggio').html('Impossibile noleggiare, inserire utente e date.')
        $('#messaggio').focus()
    }
    else{
        $.ajax({
            url: `https://site202129.tw.cs.unibo.it/api/articles/${objectId}/available?start=${start_date}&end=${end_date}`,
            type: 'GET',
            beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
            success: async function(data){
                canRent = data.available;
                if(canRent){
                    let toSend = {};
                    toSend.functionaryId = parseJWT(localStorage['token']).id;
                    toSend.object_id = objectId;
                    toSend.date_start = start_date;
                    toSend.date_end = end_date;
                    toSend.userId = $('#user').val();
                    toSend.state = $('#state').val();
                    await $.ajax({
                        url: `https://site202129.tw.cs.unibo.it/api/rentals/`,
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(toSend),
                        beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
                        success: function(data){
                            $('#messaggio').attr('style', "color: black;")
                            $('#messaggio').html('Noleggio creato, verrai reindirizzato alla home')
                            $('#messaggio').focus()
                            setTimeout(() => {redirect("home.html")}, 3500);
                        }
                    })
                    if(toSend.state == 'delayed'){
                        let toSend2 = {};
                        await $.ajax({
                            url: `https://site202129.tw.cs.unibo.it/api/articles/${objectId}`,
                            type: 'GET',
                            beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
                            success: function(data){   
                                toSend2.oldState = data.state;
                                toSend2.state = "unavailable";
                            }
                        })
                        await $.ajax({
                            url: `https://site202129.tw.cs.unibo.it/api/articles/${objectId}`,
                            type: 'PATCH',
                            data: JSON.stringify(toSend2),
                            contentType: 'application/json',
                            beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
                            success: function(data){   
                            }
                        })
                    }
                }
            },
            error: function(data){
                $('#messaggio').attr('style', "color: red;")
                $('#messaggio').html('Impossibile noleggiare, articolo già occupato')
                $('#messaggio').focus()
            }
        })
    }
}