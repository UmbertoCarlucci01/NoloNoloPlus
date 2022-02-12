var objectid;

$(document).ready(() => {
    $('#startdate').attr("min", new Date().toISOString().split('T')[0]);
    $('#enddate').attr("min", new Date(Date.parse(new Date())+1000*60*60*24).toISOString().split('T')[0]);
    let id = $.urlParameters("id")
    $.ajax({
        url: `https://site202129.tw.cs.unibo.it/api/rentals/${id}`,
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
        success: function(res){
            $("#startdate").val(res.date_start.substring(0, 10))
            $("#enddate").val(res.date_end.substring(0, 10))
            objectid = res.object_id
        }
     })  
})

function modificaNoleggio(){
    let id = $.urlParameters("id")
    let date_start = $("#startdate").val();
    let date_end = $("#enddate").val();
    $.ajax({
        url: `https://site202129.tw.cs.unibo.it/api/articles/${objectid}/available?start=${date_start}&end=${date_end}&rental=${id}`, // aggiungere id da escludere        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
        success: function(data){
            if(data.available){
                let toSend = {}
                toSend.date_start = date_start
                toSend.date_end = date_end
                $.ajax({
                    url: `https://site202129.tw.cs.unibo.it/api/rentals/${id}?staff=true`,
                    type: "PATCH",
                    data: JSON.stringify(toSend),
                    contentType: "application/json",
                    beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
                    success: function(res){
                        $("#messaggio").html("Date modificate correttamente, verrai reindirizzato alla home");
                        setTimeout(() => {redirect("home.html")}, 3500);
                    }
                })
            }
            else{
                $("#messaggio").attr("style", "color: red");
                $("#messaggio").html("Date non disponibili");
                $("#messaggio").focus();
            }
        }
    })
}

