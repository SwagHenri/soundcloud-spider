var request = require("request");

var externalLinks = [
    "https://fr2.sonsofgrowth.com",
    "https://fr1.sonsofgrowth.com",
    "https://www.sonsofgrowth.com"
];


function visit(index, tableau, callback){
    if(index >= tableau.length)
        return callback();

    var url = tableau[index];
    console.log("je vais visiter " + url);

    request({
        url: url,
        method: "GET"
    }, function(err, response, body){

        if(!err && response.statusCode == 200){
            console.log("1, j'ai visité " + url);
            console.log("2, c\'était bien");
            console.log("3, vraiment bien");
        }else
            console.log("erreur lors de la visite de " + url);

        index++;
        console.log('Nous sommes à l\'étape ' + index + '\r\n');
        if(index < tableau.length)
            return visit(index, tableau, callback);
        else
            return callback();
    });

    console.log("je continue l'execution des taches");

}



visit(0, externalLinks, function(){
    console.log("end");
});


