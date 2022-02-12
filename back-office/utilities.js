function parseJWT(token){
       var base64Url = token.split('.')[1];
       var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
       var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
         }).join(''));
       return JSON.parse(jsonPayload);
};


function redirect(page){
  $(location).attr("href", page)
}

$.urlParameters = function(params) {
  var results = new RegExp("[?&]" + params + "=([^&#]*)").exec(
    window.location.href
  );
  return results ? decodeURI(results[1]) : null;
};


