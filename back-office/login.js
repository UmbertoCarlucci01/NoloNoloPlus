function signin(){
    $("#warning").html("");
    $.post("https://site202129.tw.cs.unibo.it/api/auth/login/staff",{username: $("#user").val(), password: $("#password").val()},
    (res) => {
        localStorage.setItem('token', res.authority);
        redirect("home.html");
    }).fail(()=>{
        $("#warning").html("Credenziali errate");
    });
}
