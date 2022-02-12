function createArticle(){
    var toSend = new FormData();
    toSend.append("name", $("#nome").val());
    toSend.append("category", $("#category").val());
    toSend.append("superCategory", $("#supercategory").val());
    toSend.append("state", $("#state").val());
    toSend.append("price", $("#price").val());
    toSend.append("img", $('#fotoOggetto').prop('files')[0]);
    $.ajax({
        url: `https://site202129.tw.cs.unibo.it/api/articles/`,
        type: 'POST',
        processData: false,
        contentType: false,
        data: toSend,
        beforeSend: function(xhr){xhr.setRequestHeader('authority', JSON.stringify(localStorage['token']))},
        success: function(data){
            $('#messaggio').attr('style', "color: black;")
            $('#messaggio').html('Articolo aggiunto, verrai reindirizzato alla home')
            $('#messaggio').focus()
            setTimeout(() => {redirect("home.html")}, 3500);
        },
        error: function(err){

        },
    });
}