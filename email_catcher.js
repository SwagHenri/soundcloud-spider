var request = require("request");
var connection = null;
var mysql = require('mysql');
var jsonfile = require("jsonfile");
var sleep = require("./sleep.js");

try {
    require("./env.js");
    console.log(process.env["DBPORT"]);
}catch (e){

}

function start(callback){

    for(var i = 0; i < catcher.targets.length; i++)
        check_target(catcher.targets[i]);

    return callback();
}

function check_target(target){

    var url = "https://soundcloud.com/" + target;

    request({
        url: url,
        method: "GET",
        headers: {
            "Referer": "https://soundcloud.com/",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36"
        }
    }, function(err, response, body){
        if(!err && response.statusCode == 200){
            var user_id = body.split("soundcloud://users:")[1].split("\">")[0];



            get_followers("2t9loNQH90kzJcsFCODdigxfp325aq4z", user_id, 0, [], function(followers){
                check_followers(followers, function(followers){
                    save_followers(0, followers, target, function(){
                    })
                });
            });
        }
    });
}

function save_followers(index, followers_tmp, target, callback){

    var max_size = 2;
    var nb = (followers_tmp.length / max_size).toFixed(0);

    var followers = followers_tmp.slice(index*max_size, index*max_size+max_size);

    var emails = [];
    for(var i = 0; i < followers.length; i++){
        emails = emails.concat(followers[i].description.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi));
    }


    if(emails.length){
        var doublon_query = connection.query("SELECT email FROM soundcloud_artists_scrapping WHERE soundcloud_artists_scrapping.email IN (?);",  [emails], function (error, results, fields) {
            if(error)
                throw error;

            for(var i = 0; i < results.length; i++){
                var indexOf = emails.indexOf(results[i].email);
                emails.splice(indexOf, 1);
            }

            var data =[];
            for(var i = 0; i < followers.length; i++){
                var email = followers[i].email;
                if(emails.indexOf(email) > -1){
                    var follower = followers[i];
                    data.push({
                        related_to: target,
                        username: follower.username,
                        permalink: follower.permalink_url,
                        email: follower.email,
                        city: follower.city,
                        comments_count: follower.comments_count,
                        likes_count: follower.likes_count,
                        reposts_count: follower.repost_count,
                        followers_count: follower.followers_count,
                        followings_count: follower.followings_count,
                        tracks_count: follower.tracks_count
                    })

                }
            }
            console.log(emails);

            if(data.length){
                var insert_query = connection.query('INSERT INTO soundcloud_artists_scrapping SET ?', data, function (error, results, fields) {
                    if (error) throw error;

                    index += max_size;
                    if(index < followers_tmp.length){
                        return save_followers(index, followers_tmp, target, callback);
                    }else {
                        return callback();
                    }
                });
            }else {
                index += max_size;
                if(index < followers_tmp.length){
                    return save_followers(index, followers_tmp, target, callback);
                }else {
                    return callback();
                }
            }
        });
    }else {
        index += max_size;
        if(index < followers_tmp.length){
            return save_followers(index, followers_tmp, target, callback);
        }else {
            return callback();
        }
    }
}


function check_followers(followers_tmp, callback){

    var followers = [];
    for(var i = 0; i < followers_tmp.length; i++){
        if(followers_tmp[i].description != null && followers_tmp[i].description.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)){
            followers_tmp[i].email = followers_tmp[i].description.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)[0];
            followers.push(followers_tmp[i]);
        }
    }

    return callback(followers);
}

function get_followers(client_id, user_id, offset, followers, callback){


    var url = "https://api-v2.soundcloud.com/users/" + user_id + "/followers?client_id=" + client_id + "&limit=12&offset=" + offset + "&linked_partitioning=1&app_version=1495114752";
    console.log(url);
    var headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.8,fr-FR;q=0.6,fr;q=0.4",
        "Connection": "keep-alive",
        "Host": "api-v2.soundcloud.com",
        "Origin": "https://soundcloud.com",
        "Referer": "https://soundcloud.com/",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36"
    }


    request({
        url: url,
        headers: headers,
        method: "GET"
    }, function(err, response, body){
        if(!err && response.statusCode == 200){
            var data = JSON.parse(body);

            for(var i = 0; i < data.collection.length; i++)
                followers.push(data.collection[i]);

            if(data.next_href != null){
                sleep.sleep(1, function(){
                    var offset = data.next_href.split("offset=")[1].split("&")[0];
                    return get_followers(client_id, user_id, offset, followers, callback);
                })
            }else {
                return callback(followers);
            }
        }else {
            return callback(followers);
        }
    });
}

function init(callback){

    connection = mysql.createConnection({
        host     : process.env["HOST"],
        port     : process.env["DBPORT"],
        user     : process.env["USERNAME"],
        password : process.env["PASSWORD"],
        database : 'scrapping-site'
    });

    catcher.targets = process.env["TARGETS"].split(",");

    return callback();
}


var catcher = {
    targets: null,
    init: init,
    start: start
};

module.exports = catcher;