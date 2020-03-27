var config = require('./config.json');
var env = process.env.NODE_ENV || "development";

if(env === "development"){
    var envConfig = config[env];
        Object.keys(envConfig).forEach((key) => {
            process.env[key] = envConfig[key]
        });
    }