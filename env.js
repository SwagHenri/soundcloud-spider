var jsonfile = require("jsonfile");

var CONFIG = jsonfile.readFileSync("./config.json");

process.env["HOST"] = CONFIG.host;
process.env["DBPORT"] = CONFIG.dbport;
process.env["USERNAME"] = CONFIG.username;
process.env["PASSWORD"] = CONFIG.password;
process.env["PORT"] = CONFIG.port;
process.env["TARGETS"] = CONFIG.targets;



