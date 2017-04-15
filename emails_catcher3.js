var Nightmare = require('nightmare');
var vo = require('vo');
var fs = require("fs");
var nightmare = Nightmare({
    show: false
});
var mysql = require('mysql');


var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : 9001,
    user     : 'root',
    password : 'root',
    database : 'scrapping-site'
});

var soundcloudnames = [];
var names = [];
var nbFollowers = [];
var nbFollowings = [];
var nbTracks = [];
var souncloudtarget = 'jeejuh';
var artist = 'Jee Juh';

function countItems(){
    var soundcloudnames = document.querySelectorAll('.userBadgeListItem .userBadgeListItem__title .userBadgeListItem__heading');
    return Array.prototype.map.call(soundcloudnames, function(e) {
        return e.getAttribute("href");
    });
}

function getEmails(codeHTML){
    var emailsfound = codeHTML.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    if (emailsfound != null){
        for (i=0; i < emailsfound.length; i++){
            if(emails.indexOf(emailsfound[i]) == -1)
                emails.push(emailsfound[i]);
        };
    }else{
        console.log('Rien trouvé');
    };
}

function getSoundcloudnames(){
    var soundcloudnames = document.querySelectorAll('.userBadgeListItem .userBadgeListItem__title .userBadgeListItem__heading');
    return Array.prototype.map.call(soundcloudnames, function(e) {
        return e.getAttribute("href");
    });
};

function getNames(){
    var names = document.querySelectorAll('.userBadgeListItem .userBadgeListItem__title .userBadgeListItem__heading');
    return Array.prototype.map.call(names, function(e) {
        return e.innerText;
    });
};

function getDescription(){
    var description = document.querySelector('.infoStats__description');

}

var run = function * () {
    yield nightmare.goto('https://soundcloud.com/' + souncloudtarget + '/followers')
        .wait(1600);
    console.log('Je suis sur la page des abonnés de ' + souncloudtarget);
    var timerScroll = 0;
    var followers_artist = 0;

    var previousHeight, currentHeight=0;
    while(previousHeight !== currentHeight) {

        var followers_artist = yield nightmare.evaluate(countItems);
        console.log('Chargement n°' + timerScroll + ' des abonnés de ' + souncloudtarget + '. Nous avons récupéré : ' + followers_artist.length + ' profils Soundcloud.');
        timerScroll ++;
        previousHeight = currentHeight;
        var currentHeight = yield nightmare.evaluate(function() {
            return document.body.scrollHeight;
        });
        yield nightmare.wait(1000).scrollTo(currentHeight, 0)
            .wait(2000);
    };

    soundcloudnames = yield nightmare.evaluate(getSoundcloudnames);
    names = yield nightmare.evaluate(getNames);

    console.log(souncloudtarget + ' a ' + names.length + ' abonnements');

    for(j = 0; j < names.length; j++) {

        yield nightmare.goto('https://soundcloud.com' + soundcloudnames[j]);
        yield nightmare.wait(600);
        var emails = [];
        console.log('Etat d\' avancement total : ' + j + '/' + names.length);
        console.log('On est sur la page de : ' + soundcloudnames[j]);
        var codeHTML = yield nightmare.evaluate(function() {
            return document.querySelector('body').innerHTML;
        });
        var emailsfound = codeHTML.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        if (emailsfound != null){
            console.log('Nous avons trouvé : ' + emails + ' sur la page de ' + soundcloudnames[j]);
            for (l=0; l < emailsfound.length; l++){
                if(emails.indexOf(emailsfound[l]) == -1)
                    emails.push(emailsfound[l]);
            };
            var email_1_artist =emails[0] ;
            var doublon_query = connection.query('SELECT * FROM soundcloud_artists WHERE soundcloud_artists.email_1 = ?', email_1_artist, function (error, results, fields) {
                if (error) throw error;
                if (results == ''){
                    var post  = {username: soundcloudnames[j], email_1: emails[0], related_to: artist};
                    var insert_query = connection.query('INSERT INTO soundcloud_artists SET ?', post, function (error, results, fields) {
                        if (error) throw error;
                        // Neat!
                    });
                    console.log('L\'email de : ' + email_1_artist + ' est enregistré.');
                } else{
                    console.log('L\'email de ' + email_1_artist + ' a déjà été enregistré.' )
                }
                // Neat!
            });
        }else{
            console.log('No emails found on ' + soundcloudnames[j]);
        };
        yield nightmare.wait(600);
    };
    console.log('currentHeight: ' + currentHeight + 'px');

    yield nightmare.end();
};


vo(run)(function(err) {
    console.dir(err);
    console.log('done');
});
