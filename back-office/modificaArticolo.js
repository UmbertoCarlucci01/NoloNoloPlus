$(document).ready(() => {
    var id = $.urlParameters("id")
    $.ajax({
        url: `https://site202129.tw.cs.unibo.it/api/articles/${id}`,
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
        success: function(res){
            $("#name").attr("placeholder", res.name);
            $("#prezzo").attr("placeholder", res.price);
            $("#superCategory").append(`<option selected value="default">${res.superCategory}</option>`)
            if(res.superCategory == 'Frecce'){
                $("#superCategory").append(`<option value="Attacco">Attacco</option>`)
                $("#superCategory").append(`<option value="Difesa">Difesa</option>`)
            }
            if(res.superCategory == 'Attacco'){
                $("#superCategory").append(`<option value="Frecce">Frecce</option>`)
                $("#superCategory").append(`<option value="Difesa">Difesa</option>`)
            }
            if(res.superCategory == 'Difesa'){
                $("#superCategory").append(`<option value="Attacco">Attacco</option>`)
                $("#superCategory").append(`<option value="Frecce">Frecce</option>`)
            }
            $("#category").append(`<option value="default">${res.category}</option>`);
            if(res.category == 'Spada'){
                $("#category").append(`<option value="Busto">Busto</option>`)
                $("#category").append(`<option value="Elmo">Elmo</option>`)
                $("#category").append(`<option value="Frecce">Frecce</option>`)
                $("#category").append(`<option value="Arco">Arco</option>`)
                $("#category").append(`<option value="Artiglieria">Artiglieria</option>`)
                $("#category").append(`<option value="Gambali">Gambali</option>`)
                $("#category").append(`<option value="Scudo">Scudo</option>`)
            }
            if(res.category == 'Busto'){
                $("#category").append(`<option value="Spada">Spada</option>`)
                $("#category").append(`<option value="Elmo">Elmo</option>`)
                $("#category").append(`<option value="Frecce">Frecce</option>`)
                $("#category").append(`<option value="Arco">Arco</option>`)
                $("#category").append(`<option value="Artiglieria">Artiglieria</option>`)
                $("#category").append(`<option value="Gambali">Gambali</option>`)
                $("#category").append(`<option value="Scudo">Scudo</option>`)
            }
            if(res.category == 'Elmo'){
                $("#category").append(`<option value="Spada">Spada</option>`)
                $("#category").append(`<option value="Busto">Busto</option>`)
                $("#category").append(`<option value="Frecce">Frecce</option>`)
                $("#category").append(`<option value="Arco">Arco</option>`)
                $("#category").append(`<option value="Artiglieria">Artiglieria</option>`)
                $("#category").append(`<option value="Gambali">Gambali</option>`)
                $("#category").append(`<option value="Scudo">Scudo</option>`)
            }
            if(res.category == 'Frecce'){
                $("#category").append(`<option value="Spada">Spada</option>`)
                $("#category").append(`<option value="Busto">Busto</option>`)
                $("#category").append(`<option value="Elmo">Elmo</option>`)
                $("#category").append(`<option value="Arco">Arco</option>`)
                $("#category").append(`<option value="Artiglieria">Artiglieria</option>`)
                $("#category").append(`<option value="Gambali">Gambali</option>`)
                $("#category").append(`<option value="Scudo">Scudo</option>`)
            }
            if(res.category == 'Arco'){
                $("#category").append(`<option value="Spada">Spada</option>`)
                $("#category").append(`<option value="Busto">Busto</option>`)
                $("#category").append(`<option value="Elmo">Elmo</option>`)
                $("#category").append(`<option value="Frecce">Frecce</option>`)
                $("#category").append(`<option value="Artiglieria">Artiglieria</option>`)
                $("#category").append(`<option value="Gambali">Gambali</option>`)
                $("#category").append(`<option value="Scudo">Scudo</option>`)
            }
            if(res.category == 'Artiglieria'){
                $("#category").append(`<option value="Spada">Spada</option>`)
                $("#category").append(`<option value="Busto">Busto</option>`)
                $("#category").append(`<option value="Elmo">Elmo</option>`)
                $("#category").append(`<option value="Frecce">Frecce</option>`)
                $("#category").append(`<option value="Arco">Arco</option>`)
                $("#category").append(`<option value="Gambali">Gambali</option>`)
                $("#category").append(`<option value="Scudo">Scudo</option>`)
            }
            if(res.category == 'Gambali'){
                $("#category").append(`<option value="Spada">Spada</option>`)
                $("#category").append(`<option value="Busto">Busto</option>`)
                $("#category").append(`<option value="Elmo">Elmo</option>`)
                $("#category").append(`<option value="Frecce">Frecce</option>`)
                $("#category").append(`<option value="Arco">Arco</option>`)
                $("#category").append(`<option value="Artiglieria">Artiglieria</option>`)
                $("#category").append(`<option value="Scudo">Scudo</option>`)
            }
            if(res.category == 'Scudo'){
                $("#category").append(`<option value="Spada">Spada</option>`)
                $("#category").append(`<option value="Busto">Busto</option>`)
                $("#category").append(`<option value="Elmo">Elmo</option>`)
                $("#category").append(`<option value="Frecce">Frecce</option>`)
                $("#category").append(`<option value="Arco">Arco</option>`)
                $("#category").append(`<option value="Artiglieria">Artiglieria</option>`)
                $("#category").append(`<option value="Gambali">Gambali</option>`)
            }
            if(res.state=='perfect'){
                $("#state").append(`<option selected value="default">Perfetto</option>`);
                $("#state").append(`<option value="good">Ottimo</option>`)
                $("#state").append(`<option value="suitable">Buono</option>`)
            }
            if(res.state=='good'){
                $("#state").append(`<option selected value="default">Ottimo</option>`);
                $("#state").append(`<option value="perfect">Perfetto</option>`)
                $("#state").append(`<option value="suitable">Buono</option>`)
            }
            if(res.state=='suitable'){
                $("#state").append(`<option selected value="default">Buono</option>`);
                $("#state").append(`<option value="perfect">Perfetto</option>`)
                $("#state").append(`<option value="good">Ottimo</option>`)
            }
        }
     })  
})

function modificaArticolo(){
    let id = $.urlParameters("id")
    let toSend = {}
    if($("#name").val()=="" && $("#prezzo").val() == "" && $("#superCategory").val() == "default" && $("#category").val() == "default" && $("#state").val() == "default")
        redirect("home.html")
    else {
        if($("#name").val()!="") toSend.name = $("#name").val()
        if($("#prezzo").val()!="") toSend.price = $("#prezzo").val()
        if($("#category").val()!="default") toSend.category = $("#category").val()
        if($("#superCategory").val()!="default") toSend.superCategory = $("#superCategory").val()
        if($("#state").val()!="default") toSend.state = $("#state").val()
        console.log(toSend)
        $.ajax({
            url: `https://site202129.tw.cs.unibo.it/api/articles/${id}`,
            type: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify(toSend),
            beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
            success: function(data){
                $("#messaggio").html("Dati modificati correttamente, verrai reindirizzato alla home.")
                $("#messaggio").focus();
                setTimeout(() => {redirect("home.html")}, 3500);
            }
        });
    }
}