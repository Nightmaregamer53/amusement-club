module.exports = {
    connect, processRequest
}

var mongodb, ucollection;
const fs = require('fs');
const logger = require('./log.js');
const dbManager = require('./dbmanager.js');
const heroDB = require('./heroes.json');

function connect(db) {
    mongodb = db;
    ucollection = db.collection('users');
}

function processRequest(userID, args, callback) {
    ucollection.findOne({ discord_id: userID }).then((dbUser) => {
        if(!dbUser) return;

        var req = args.shift();
        switch(req) {
            case "list":
                getHeroes(dbUser, callback);
                break;
            case "info":
                getInfo(dbUser, args, callback);
                break;
            case "get":
                assign(dbUser, args, callback);
                break;
            default:
                getHero(dbUser, callback);
        }
    });
}

function getHero(dbUser, callback) {
    var h = dbUser.hero;
    if(!h) {
        let stars = dbManager.countCardLevels(dbUser.cards);
        var msg = "**" + dbUser.username + "**, you have no any hero yet. \n";
        if(stars > 30) msg += "To choose one, use `->hero list`";
        else msg += "You can get one once you have more than 75 \u2B50 stars (you have now " + stars + "\u2B50 stars)";
        callback(msg);
        return;
    }

    callback(h.fraction + " **" + h.name + "** level **" + h.level + "** arrives!", 
        { file: "./heroes/" + h.name.toLowerCase().replace(/ /g, "_") + ".png" });
}

function getHeroes(dbUser, callback) {
    let stars = dbManager.countCardLevels(dbUser.cards);
    if(stars < 30) {
        callback("**" + dbUser.username + "**, you should have at least 75 \u2B50 stars to have a hero.\n"
            + "You have now " + stars + " \u2B50 stars.");
        return;
    }
    
    callback("Use `->hero info [hero name]` or `->hero info all`", { file: "./heroes/list.png" });
}

function getInfo(dbUser, args, callback) {
    var req = args.join(' ');
    if(req == 'all') {
        callback("Use `->hero get [hero name]`. **Changing hero will not be free!**\n"
            + "Use `->hero info [hero name]` to get specific hero info", 
            { file: "./heroes/all.png" });
        return;
    }

    var h = heroDB.filter(h => h.name.toLowerCase().includes(req))[0];
    if(h) {
        console.log(h.name.toLowerCase().replace(/ /g, "_"));
        callback("Use `->hero get [hero name]`. **Changing hero will not be free!**", 
            { file: "./heroes/" + h.name.toLowerCase().replace(/ /g, "_") + ".png" });
    }
}

function assign(dbUser, args, callback) {
    if(dbUser.hero) {
        callback("**" + dbUser.username + "**, you already have a hero!\n"
        + "Hero change comes soon!");
        return;
    }

    var req = args.join(' ');
    var h = heroDB.filter(h => h.name.toLowerCase().includes(req))[0];
    if(h) {
        ucollection.update(
            { discord_id: dbUser.discord_id },
            {
                $set: {hero: h}
            }
        ).then(() => {
            callback("**" + dbUser.username + "** and **" + h.name + "** made a contract! Congratulations!");
        });
        
    } else {
        callback("Can't find hero named '" + req + "'");
    }
}

function getHeroEffect() {
    
}