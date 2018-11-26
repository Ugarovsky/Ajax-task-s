var apiBaseUrl = 'http://localhost:3000/api';

function fetch(params) {
    var{ url, method, body, headers } = params;

    return new Promise(function(resolve, reject) {
        var http = new XMLHttpRequest();

        http.open(method, `${apiBaseUrl}/${url}`);

        if (headers) {
            headers.forEach(function(header) {
                http.setRequestHeader(header.name, header.value);
            });
        }

        http.onload = function(response) {
            if (http.status != 200) {
                reject(http.responseText);
            }
            else {
                resolve(JSON.parse(http.responseText));
            }
        };
        http.onerror = function(error){ reject(http.responseText)};
try{
        http.send(body ? JSON.stringify(body) : null);
}
catch{
    alert("Server Error!");
}
    });
}


