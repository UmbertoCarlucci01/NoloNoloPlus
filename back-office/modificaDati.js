$(document).ready(() => {
    var id = $.urlParameters("id")
    $.ajax({
        url: `https://site202129.tw.cs.unibo.it/api/users/${id}`,
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
        success: function(res){
            $("#nome").attr("placeholder", res.name);
            $("#cognome").attr("placeholder", res.surname);
            $("#username").attr("placeholder", res.username);
            $('#residenza').attr("placeholder", res.residence)
            oldres = res;
            $("#paymentMethod").append(`<option selected value="default">${res.paymentmethod}</option>`)
            $.ajax({
                url: `https://site202129.tw.cs.unibo.it/api/paymentMethods/`,
                type: "GET",
                success: function(res){
                    for(let i = 0; i < res.length; i++){
                        if(oldres.paymentmethod!=res[i].name)
                            $("#paymentMethod").append(`<option value="${res[i].name}">${res[i].name}</option>`);
                    }
                }
            })
        }
     })  
})

function modificaUtente(){
    if(($("#nome").val() == "") && ($("#cognome").val() == "") && ($("#username").val() == "") && ($("#paymentMethod").val() == "default") && ($("#residenza").val() == ""))
       redirect("home.html");
    else{
        var id = $.urlParameters("id")
        var ToSend = {};
        if($("#nome").val() != "") ToSend.name = $("#nome").val();
        if($("#cognome").val() != "") ToSend.surname = $("#cognome").val();
        if($("#username").val() != "") ToSend.username = $("#username").val();
        if($("#residenza").val() != "") ToSend.residence = $("#residenza").val();
        if($("#paymentMethod").val() != "default") ToSend.paymentmethod = $("#paymentMethod").val();
        $.ajax({
            url: `https://site202129.tw.cs.unibo.it/api/users/${id}`,
            type: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify(ToSend),
            beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
            success: function(data){
                if(ToSend.username) $("#messaggio").html("Username modificato correttamente, verrai reindirizzato alla home.");
                else $("#messaggio").html("Dati modificati correttamente, verrai reindirizzato alla home.")
                $("#messaggio").focus();
                setTimeout(() => {redirect("home.html")}, 3500);
            },
            error: function(err){
                $("#messaggio").attr("style", "color: red");
                $("#messaggio").html("Username già esistente");
                $("#messaggio").focus();
            },
        });
    }
}

setTimeout(function(){}, 5000);






