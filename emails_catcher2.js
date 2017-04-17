var Nightmare = require('nightmare');
var vo = require('vo');
var fs = require("fs");
var nightmare = Nightmare({
    show: false
});
var mysql = require('mysql');

try {
    require("./env.js");
    console.log(process.env.PORT);
}catch (e){
}

var connection = mysql.createConnection({
    host     : process.env.HOST,
    port     : process.env.PORT,
    user     : process.env.USERNAME,
    password : process.env.PASSWORD,
    database : 'scrapping-site'
});

var soundcloudnames = [];
var names = [];
var nbFollowers = [];
var nbFollowings = [];
var nbTracks = [];
var souncloudtarget = 'thebraincollective';
var artist = 'The Brain Collective';

function getNbFollowers(){
    var nbFollowers = document.querySelectorAll('.infoStats__stat a[href$="/followers"] .infoStats__value ');
    return Array.prototype.map.call(nbFollowers, function(e) {
        var m = e.innerText
            .replace(".", "")
            .replace(",1[0-9]K", "100").replace(",2[0-9]K", "200").replace(",3[0-9]K", "300").replace(",4[0-9]K", "400").replace(",5[0-9]K", "500").replace(",6[0-9]K", "600").replace(",7[0-9]K", "700").replace(",8[0-9]K", "800").replace(",9[0-9]K", "900")
            .replace(",1K", "100").replace(",2K", "200").replace(",3K", "300").replace(",4K", "400").replace(",5K", "500").replace(",6K", "600").replace(",7K", "700").replace(",8K", "800").replace(",9K", "900")
            .replace(",1M", "100000").replace(",11M", "110000").replace(",12M", "120000").replace(",13M", "130000").replace(",14M", "140000").replace(",15M", "150000").replace(",16M", "160000").replace(",17M", "170000").replace(",18M", "180000").replace(",19M", "190000")
            .replace(",2M", "200000").replace(",21M", "210000").replace(",22M", "220000").replace(",23M", "230000").replace(",24M", "240000").replace(",25M", "250000").replace(",26M", "260000").replace(",27M", "270000").replace(",28M", "280000").replace(",29M", "290000")
            .replace(",3M", "300000").replace(",31M", "310000").replace(",32M", "320000").replace(",33M", "330000").replace(",34M", "340000").replace(",35M", "350000").replace(",36M", "360000").replace(",37M", "370000").replace(",38M", "380000").replace(",39M", "390000")
            .replace(",4M", "400000").replace(",41M", "410000").replace(",42M", "420000").replace(",43M", "430000").replace(",44M", "440000").replace(",45M", "450000").replace(",46M", "460000").replace(",47M", "470000").replace(",48M", "480000").replace(",49M", "490000")
            .replace(",5M", "500000").replace(",51M", "510000").replace(",52M", "520000").replace(",53M", "530000").replace(",54M", "540000").replace(",55M", "550000").replace(",56M", "560000").replace(",57M", "570000").replace(",58M", "580000").replace(",59M", "590000")
            .replace(",6M", "600000").replace(",61M", "610000").replace(",62M", "620000").replace(",63M", "630000").replace(",64M", "640000").replace(",65M", "650000").replace(",66M", "660000").replace(",67M", "670000").replace(",68M", "680000").replace(",69M", "690000")
            .replace(",7M", "700000").replace(",71M", "710000").replace(",72M", "720000").replace(",73M", "730000").replace(",74M", "740000").replace(",75M", "750000").replace(",76M", "760000").replace(",77M", "770000").replace(",78M", "780000").replace(",79M", "790000")
            .replace(",8M", "800000").replace(",81M", "810000").replace(",82M", "820000").replace(",83M", "830000").replace(",84M", "840000").replace(",85M", "850000").replace(",86M", "860000").replace(",87M", "870000").replace(",88M", "880000").replace(",89M", "890000")
            .replace(",9M", "900000").replace(",91M", "910000").replace(",92M", "920000").replace(",93M", "930000").replace(",94M", "940000").replace(",95M", "950000").replace(",96M", "960000").replace(",97M", "970000").replace(",98M", "980000").replace(",99M", "990000")
            .replace(",", "")
            .replace("K", "000")
            .replace("M", "000000");
        return Number(m);
    });
};

function getNbFollowings(){
    var nbFollowings = document.querySelectorAll('.infoStats__stat a[href$="/following"] .infoStats__value ');
    return Array.prototype.map.call(nbFollowings, function(e) {
        var m = e.innerText
            .replace(".", "")
            .replace(",1[0-9]K", "100").replace(",2[0-9]K", "200").replace(",3[0-9]K", "300").replace(",4[0-9]K", "400").replace(",5[0-9]K", "500").replace(",6[0-9]K", "600").replace(",7[0-9]K", "700").replace(",8[0-9]K", "800").replace(",9[0-9]K", "900")
            .replace(",1K", "100").replace(",2K", "200").replace(",3K", "300").replace(",4K", "400").replace(",5K", "500").replace(",6K", "600").replace(",7K", "700").replace(",8K", "800").replace(",9K", "900")
            .replace(",1M", "100000").replace(",11M", "110000").replace(",12M", "120000").replace(",13M", "130000").replace(",14M", "140000").replace(",15M", "150000").replace(",16M", "160000").replace(",17M", "170000").replace(",18M", "180000").replace(",19M", "190000")
            .replace(",2M", "200000").replace(",21M", "210000").replace(",22M", "220000").replace(",23M", "230000").replace(",24M", "240000").replace(",25M", "250000").replace(",26M", "260000").replace(",27M", "270000").replace(",28M", "280000").replace(",29M", "290000")
            .replace(",3M", "300000").replace(",31M", "310000").replace(",32M", "320000").replace(",33M", "330000").replace(",34M", "340000").replace(",35M", "350000").replace(",36M", "360000").replace(",37M", "370000").replace(",38M", "380000").replace(",39M", "390000")
            .replace(",4M", "400000").replace(",41M", "410000").replace(",42M", "420000").replace(",43M", "430000").replace(",44M", "440000").replace(",45M", "450000").replace(",46M", "460000").replace(",47M", "470000").replace(",48M", "480000").replace(",49M", "490000")
            .replace(",5M", "500000").replace(",51M", "510000").replace(",52M", "520000").replace(",53M", "530000").replace(",54M", "540000").replace(",55M", "550000").replace(",56M", "560000").replace(",57M", "570000").replace(",58M", "580000").replace(",59M", "590000")
            .replace(",6M", "600000").replace(",61M", "610000").replace(",62M", "620000").replace(",63M", "630000").replace(",64M", "640000").replace(",65M", "650000").replace(",66M", "660000").replace(",67M", "670000").replace(",68M", "680000").replace(",69M", "690000")
            .replace(",7M", "700000").replace(",71M", "710000").replace(",72M", "720000").replace(",73M", "730000").replace(",74M", "740000").replace(",75M", "750000").replace(",76M", "760000").replace(",77M", "770000").replace(",78M", "780000").replace(",79M", "790000")
            .replace(",8M", "800000").replace(",81M", "810000").replace(",82M", "820000").replace(",83M", "830000").replace(",84M", "840000").replace(",85M", "850000").replace(",86M", "860000").replace(",87M", "870000").replace(",88M", "880000").replace(",89M", "890000")
            .replace(",9M", "900000").replace(",91M", "910000").replace(",92M", "920000").replace(",93M", "930000").replace(",94M", "940000").replace(",95M", "950000").replace(",96M", "960000").replace(",97M", "970000").replace(",98M", "980000").replace(",99M", "990000")
            .replace(",", "")
            .replace("K", "000")
            .replace("M", "000000");
        return Number(m);
    });
};

function getNbTracks(){
    var nbTracks = document.querySelectorAll('.infoStats__stat a[href$="/tracks"] .infoStats__value ');
    return Array.prototype.map.call(nbTracks, function(e) {
        var m = e.innerText
            .replace(".", "")
            .replace(",1[0-9]K", "100").replace(",2[0-9]K", "200").replace(",3[0-9]K", "300").replace(",4[0-9]K", "400").replace(",5[0-9]K", "500").replace(",6[0-9]K", "600").replace(",7[0-9]K", "700").replace(",8[0-9]K", "800").replace(",9[0-9]K", "900")
            .replace(",1K", "100").replace(",2K", "200").replace(",3K", "300").replace(",4K", "400").replace(",5K", "500").replace(",6K", "600").replace(",7K", "700").replace(",8K", "800").replace(",9K", "900")
            .replace(",1M", "100000").replace(",11M", "110000").replace(",12M", "120000").replace(",13M", "130000").replace(",14M", "140000").replace(",15M", "150000").replace(",16M", "160000").replace(",17M", "170000").replace(",18M", "180000").replace(",19M", "190000")
            .replace(",2M", "200000").replace(",21M", "210000").replace(",22M", "220000").replace(",23M", "230000").replace(",24M", "240000").replace(",25M", "250000").replace(",26M", "260000").replace(",27M", "270000").replace(",28M", "280000").replace(",29M", "290000")
            .replace(",3M", "300000").replace(",31M", "310000").replace(",32M", "320000").replace(",33M", "330000").replace(",34M", "340000").replace(",35M", "350000").replace(",36M", "360000").replace(",37M", "370000").replace(",38M", "380000").replace(",39M", "390000")
            .replace(",4M", "400000").replace(",41M", "410000").replace(",42M", "420000").replace(",43M", "430000").replace(",44M", "440000").replace(",45M", "450000").replace(",46M", "460000").replace(",47M", "470000").replace(",48M", "480000").replace(",49M", "490000")
            .replace(",5M", "500000").replace(",51M", "510000").replace(",52M", "520000").replace(",53M", "530000").replace(",54M", "540000").replace(",55M", "550000").replace(",56M", "560000").replace(",57M", "570000").replace(",58M", "580000").replace(",59M", "590000")
            .replace(",6M", "600000").replace(",61M", "610000").replace(",62M", "620000").replace(",63M", "630000").replace(",64M", "640000").replace(",65M", "650000").replace(",66M", "660000").replace(",67M", "670000").replace(",68M", "680000").replace(",69M", "690000")
            .replace(",7M", "700000").replace(",71M", "710000").replace(",72M", "720000").replace(",73M", "730000").replace(",74M", "740000").replace(",75M", "750000").replace(",76M", "760000").replace(",77M", "770000").replace(",78M", "780000").replace(",79M", "790000")
            .replace(",8M", "800000").replace(",81M", "810000").replace(",82M", "820000").replace(",83M", "830000").replace(",84M", "840000").replace(",85M", "850000").replace(",86M", "860000").replace(",87M", "870000").replace(",88M", "880000").replace(",89M", "890000")
            .replace(",9M", "900000").replace(",91M", "910000").replace(",92M", "920000").replace(",93M", "930000").replace(",94M", "940000").replace(",95M", "950000").replace(",96M", "960000").replace(",97M", "970000").replace(",98M", "980000").replace(",99M", "990000")
            .replace(",", "")
            .replace("K", "000")
            .replace("M", "000000");
        return Number(m);
    });
};

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

        console.log('Chargement n°' + timerScroll + ' des abonnés de ' + souncloudtarget + '. Nous avons récupéré : ' + ((timerScroll * 24)+24) + ' profils Soundcloud.');
        timerScroll ++;
        previousHeight = currentHeight;
        var currentHeight = yield nightmare.evaluate(function() {
            return document.body.scrollHeight;
        });
        yield nightmare.wait(1000).scrollTo(currentHeight, 0)
            .wait(2000);
    };

    soundcloudnames = yield nightmare.evaluate(getSoundcloudnames);


    console.log(souncloudtarget + ' a ' + soundcloudnames.length + ' abonnements');

    for(j = 0; j < soundcloudnames.length; j++) {

        yield nightmare.goto('https://soundcloud.com' + soundcloudnames[j]);
        yield nightmare.wait(600);
        nbFollowers = yield nightmare.evaluate(getNbFollowers);
        nbFollowings = yield nightmare.evaluate(getNbFollowings);
        nbTracks = yield nightmare.evaluate(getNbTracks);
        console.log(soundcloudnames[j] + 'a un nombre de followers de : ' + nbFollowers[0] + ', un nombre des abonnements : ' + nbFollowings[0] + ' et un nombre des titres : ' + nbTracks[0]);

        var emails = [];
        console.log('Etat d\' avancement total : ' + j + '/' + soundcloudnames.length);
        console.log('On est sur la page de : ' + soundcloudnames[j] + ' relié à l\'artiste: ' + artist);
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
                    var post  = {username: soundcloudnames[j], email_1: emails[0], related_to: artist, nb_followers: nbFollowers, nb_followings: nbFollowings, nb_tracks: nbTracks};
                    var insert_query = connection.query('INSERT INTO soundcloud_artists SET ?', post, function (error, results, fields) {
                        if (error) throw error;
                        // Neat!
                    });
                    console.log('L\'email de : ' + email_1_artist + ' est enregistré. Abonnements, abonnées, tracks : ' + nbFollowings + ' ' + nbFollowers + ' ' + nbTracks);
                } else{
                    console.log('L\'email de ' + email_1_artist + ' a déjà été enregistré. Abonnements, abonnées, tracks : ' + nbFollowings + ' ' + nbFollowers + ' ' + nbTracks )
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




function start(){
    vo(run)(function(err) {
        console.dir(err);
        console.log('done');
    });
}

module.exports = {
    start: start
};
